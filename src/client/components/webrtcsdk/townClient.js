import * as Signal from './signal/json-rpc-impl';
import * as IonSDK from './index';

class townClient {
    // config = {url, config}
    constructor(url, config, joinConfig, sessionName, userId) {
        // joinConfig = {
        //     no_publish: false,
        //     no_subscribe: false,
        //     selective_pub_sub: true,
        // }
        this.userId = userId;
        this.sessionName = sessionName;
        this._peerlist = {};
        this.signal = new Signal.IonSFUJSONRPCSignal(url);
        this.client = new IonSDK.Client(this.signal, config);
        this.signal.onopen = () => this.client.join(sessionName, userId, joinConfig).then(() => {
            if(this._onApiReady){
                this._onApiReady(true);
            }
        }).catch(() => {
            if(this._onApiReady){
                this._onApiReady(false);
            }
        });

        //=== track
        this.client.ontrack = (track, stream) => {
            this.getPeerIdFromPeerList(stream.id).then((peerId) => {
                this._ontrack(track, stream, peerId);
            }).catch((e) => {
                console.error('ontrack triggerd but no peer exist in peerlist');
            })
        }
    }

    publish(media) {
        if (media) {
            this.media = media;
            this.client.publish(this.media);
        } else {
            if (!this.media) {
                IonSDK.LocalStream.getUserMedia({
                    resolution: "vga",
                    audio: true,
                    codec: "vp8",
                }).then((media) => {
                    this.media = media;
                    this.client.publish(media);
                }).catch(console.error);
            } else {
                this.client.publish(this.media);
            }
        }
    }

    unpublish() {
        this.media.unpublish();
        this.media = null;
    }

    set ontrack(f) {
        this._ontrack = f;
    }
    set onReady(f){
        this._onApiReady = f;
    }

    subscribe(targetUserId, pubsubType) {
        const request = {
            uid: this.userId, tid: targetUserId, type: pubsubType,
        };
        this.client.pubsub(request);
    }

    mute(type) {
        // type === 'video', 'audio'
        if (this.media) {
            this.media.mute(type);
        } else {
            console.warn(`media[stream] not exist`);
        }
    }

    unmute(type) {
        if (this.media) {
            this.media.unmute(type);
        } else {
            console.warn(`media[stream] not exist`);
        }
    }

    close() {
        this.client.close();
    }

    getPeerIdFromPeerList(streamId){
        return new Promise((resolve, reject) => {
            // Lazy Initialize
            if(this._peerlist[streamId]){
                resolve(this._peerlist[streamId]);
            }
            this.signal.call('peerlist', {}).then((data) => {
                this._peerlist = data;
                const peerId = this._peerlist[streamId];
                if(peerId)
                    resolve(peerId);
                else
                    reject('not exist');
            });
        })
    }
    get peerlist(){
        return this._peerlist;
    }
}
export {townClient};

