import {OpenVidu} from 'openvidu-browser';
import { useAxios } from '../utils/useAxios.ts';
import { useRtcStore } from "../stores/rtc.ts";

export function useOpenVidu() {
    const axios = useAxios();
    const rtcStore = useRtcStore();

    const masterCreate = () => {
        createSession().then(
            (sessionId) => {
                createToken(sessionId).then(
                    (token) => {
                        connect(token);
                    }
                )
            }
        )

    };
    //의존성 체크 필요

    const partnerJoin = (sessionId: string) => {
        createToken(sessionId).then(
            (token) => {
                connect(token);
            }
        )
    }

    const createSession = async () => {
        try {
            const response = await axios.post('/sessions');
            const sessionId = response.data;
            rtcStore.setSessionId(sessionId);
            console.log("sessionId: ", sessionId);
            return sessionId;
        } catch (error) {
            console.error('세션 열기 실패:', error);
        }
    };

    const createToken = async (sessionId: string) => {
        try {
            const response = await axios.post('sessions/'+ sessionId+ '/connection');
            rtcStore.setConnectionId(response.data.connectionId);
            return response.data.token;
        } catch (error) {
            console.error('토큰 생성 실패:', error);
        }
    };

    const connect = async (token: string) => {
        const ov = new OpenVidu();
        ov.initSession();

        // const subscribers =  rtcStore.getSubscribers();
        // subscribers?.forEach((subscriber, index) => {
        //     const video = document.createElement('video');
        //     video.autoplay = true;
        //     video.controls = false;
        //     video.id = `subscriberVideo_${index}`;
        //     subscriber.addVideoElement(video);
        //     //subscriberVideosRef.current?.appendChild(video);
        // });
        // rtcStore.setSubscribers(subscribers);

        ov.session.on('streamCreated', (event) => {
            ov.session.subscribe(event.stream, 'session-ui');
            const subscriber = ov.session.subscribe(event.stream, 'session-ui');
            rtcStore.setSubscriber(subscriber);
        });

        ov.session.on('streamDestroyed', (_event) => {
            //deleteSubscriber(event.stream.streamManager);
        });

        ov.session.on('exception', (exception) => {
            console.warn(exception);
        });

        await ov.session.connect(token);
        const _publisher = await ov.initPublisherAsync(undefined, {
            publishAudio: true,
            publishVideo: true,
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: true,
        });
        await ov.session.publish(_publisher);

        // let devices = await ov.getDevices();
        // let videoDevices = devices.filter((device) => device.kind === 'videoinput');
        // let currentVideoDeviceId = _publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
        // const _currentVideoDevice = videoDevices.find((device) => device.deviceId === currentVideoDeviceId);

        rtcStore.setOpenVidu(ov);
        rtcStore.setStreamManager(_publisher);
    }

    // const deleteSession = async (sessionId:string) => {
    //     try {
    //         await axios.delete(`sessions/${sessionId}`);
    //         rtcStore.clearRtc();
    //     } catch (error) {
    //         console.error('세션 삭제 에러:', error);
    //     }
    // };



    return { masterCreate, partnerJoin };
}
