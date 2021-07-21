import {Key} from "ts-keycode-enum";
import {directionMap} from "../common/constants";

export default class CentiKeyboard {

    constructor() {

        this.intervalHandler = undefined;
        this.inputStep = 0; //주기적으로 인풋 메시지를 처리할 수록 스텝을 구분한다.
        this.inputQueue = [];   //입력되었으나 홀드되지 않은 키 상태
        this.inputStatus = {
            up: { timestamp: -1, step: -1 },
            down: { timestamp: -1, step: -1 },
            left: { timestamp: -1, step: -1 },
            right: { timestamp: -1, step: -1 }
        };  //홀드에 관한 상태
        this.isStopped = true;
        this.stoppedCnt = 0;
        this.currentDirection = "stand";
        this.ce = undefined;
    }

    init(clientEngine) {
        this.ce = clientEngine;
        window.addEventListener("keydown", this.keyDown.bind(this));
        window.addEventListener("keyup", this.keyUp.bind(this));

        this.intervalHandler = setInterval(() => {
            let latestHoldTime = -1;
            let latestHoldDir;
            for (const [dir, {timestamp, step}] of Object.entries(this.inputStatus)) {
                // console.log(latestHoldDir, latestHoldTime, step)
                if (latestHoldTime < timestamp) {
                    latestHoldDir = dir;
                    latestHoldTime = timestamp;
                }
            }
            // console.log(`inputStep: ${this.inputStep}`)

            let moved = false;
            let sentPress = undefined;
            // 키를 짧게 눌렀다 때는 경우 처리,
            while(this.inputQueue.length > 0) {

                let input = this.inputQueue.shift();
                // console.log(this.inputStep, sentPress, input, "press", this.isCross(sentPress, input));
                if (sentPress === undefined || this.isCross(sentPress, input) === false) {
                    // console.log(this.inputStep, input, "press-sent");
                    if (this.isStopped && this.currentDirection !== input) {
                        clientEngine.sendInput(input, {move: false});
                    } else {
                        clientEngine.sendInput(input, {move: true});
                        moved = true;
                    }
                    sentPress = input;
                    this.stoppedCnt = 0;
                    this.currentDirection = input;
                }
            }

            //키를 홀드하는 경우 처리
            if (!sentPress && latestHoldDir) {
                if (this.isStopped && this.currentDirection !== latestHoldDir) {
                    clientEngine.sendInput(latestHoldDir, {move: false});
                } else {
                    clientEngine.sendInput(latestHoldDir, {move: true});
                    moved = true;
                }
                this.stoppedCnt = 0;
                this.currentDirection = latestHoldDir;
            }

            if (moved) {
                this.isStopped = false;
            } else {
                this.stoppedCnt ++;
                if (this.stoppedCnt > 6) {
                    this.isStopped = true;
                }
            }
            this.inputStep ++;
            if (this.inputStep > 100000) {
                this.inputStep = 0;
            }
        }, 1000/7);
    }

    clear() {
        window.removeEventListener("keydown", this.keyDown.bind(this));
        window.removeEventListener("keyup", this.keyUp.bind(this));
        if (this.intervalHandler) {
            clearInterval(this.intervalHandler);
        }
    }

    getInput(keyCode) {
        switch (keyCode) {
            case Key.UpArrow:
                return "up";
            case Key.DownArrow:
                return "down";
            case Key.LeftArrow:
                return "left";
            case Key.RightArrow:
                return "right";
        }
        return undefined;
    }

    getAxis(input) {
        switch (input) {
            case "up":
            case "down":
                return "y";
            case "left":
            case "right":
                return "x";
        }
        return undefined;
    }

    isCross(input1, input2) {
        let axis1 = this.getAxis(input1);
        let axis2 = this.getAxis(input2);
        if (!!axis1 && !!axis2) {
            return axis1 !== axis2;
        }
        return undefined;
    }

    keyDown(ev) {

        let input = this.getInput(ev.keyCode);
        if (!input) {
            return;
        }
        if(this.ce){
            this.ce.deliver({moving: false, dirs: []});
        }
        if (this.inputStatus[input].timestamp === -1) {
            this.inputStatus[input].timestamp = Date.now();
            this.inputStatus[input].step = this.inputStep;
        }
    }

    keyUp(ev) {

        let input = this.getInput(ev.keyCode);
        if (!input) {
            return;
        }
        this.inputStatus[input].timestamp = -1;
        if (this.inputStatus[input].step === this.inputStep) {
            this.inputQueue.push(input);
        }
    }
}
