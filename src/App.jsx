import { useState, useEffect } from 'react'
import './App.css'
import React from 'react';
import VideoJS from './components/video.jsx';
import videojs from 'video.js';
import 'videojs-markers/dist/videojs.markers.css';
import 'videojs-markers';
import AnnotationComments from '@contently/videojs-annotation-comments'
videojs.registerPlugin('annotationComments', AnnotationComments(videojs))
import jquery from 'jquery'
import '@contently/videojs-annotation-comments/build/css/annotations.css'
function App() {
    window.$ = window.jQuery = jquery;
    const playerRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: '/asset/video.mp4',
            type: 'video/mp4'
        }]
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;
        player.markers({
            markerStyle: {
                'width':'10px',
                'border-radius': '30%',
                'background-color': 'red'
            },
            markers: [
                { time: 10, text: 'Annotation 1' },
                { time: 25, text: 'Annotation 2' },
                // Add more annotations as needed
            ],
        });

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });
        const pluginOptions = {
            // Collection of annotation data to initialize
            annotationsObjects: [],
            // Flexible meta data object (currently used for user data, but addl data can be provided to wrap each comment with metadata - provide the id of the current user and fullname of the current user at minimum, which are required for the UI)
            meta: { user_id: null, user_name: null },
            // Use arrow keys to move through annotations when Annotation mode is active
            bindArrowKeys: true,
            // Show or hide the control panel and annotation toggle button (NOTE - if controls are hidden you must provide custom UI and events to drive the annotations - more on that in "Programmatic Control" below)
            showControls: true,
            // Show or hide the comment list when an annotation is active. If false, the text 'Click and drag to select', will follow the cursor during annotation mode
            showCommentList: true,
            // If false, annotations mode will be disabled in fullscreen
            showFullScreen: true,
            // Show or hide the tooltips with comment preview, and annotation shape, on marker hover or timeline activate
            showMarkerShapeAndTooltips: true,
            // If false, step two of adding annotations (writing and saving the comment) will be disabled
            internalCommenting: true,
            // If true, toggle the player to annotation mode immediately after init. (NOTE - "annotationModeEnabled" event is not fired for this initial state)
            startInAnnotationMode: false
        };
        var plugin = player.annotationComments(pluginOptions)
        plugin.fire('newAnnotation', {
            id: 1,
            range: { start: 5, end: null },
            shape: { // NOTE - x/y vals are % based (Floats) in video, not pixel values
                x1: null,
                x2: null,
                y1: null,
                y2: null
            },
            commentStr: "This is my comment."
        });
        const canvasElement = canvasRef.current;
        const ctx = canvasElement.getContext('2d');

        player.on('timeupdate', () => {
            // Clear previous annotations
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            // Draw new annotations based on the current time
            const currentTime = player.currentTime();
            if (currentTime >= 10 && currentTime <= 15) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.fillRect(50, 50, 100, 50);
                ctx.fillRect(150, 150, 100, 50);
            }
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    return (
        <>
            <div style={{width:"500px", position:"relative"}}>

                <VideoJS options={videoJsOptions} onReady={handlePlayerReady}   />
                <canvas width={640}
                        height={360}  ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none'  }} />
                <div>video</div>
            </div>

        </>
    );
}

export default App
