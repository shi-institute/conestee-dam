/*
 * Defines the Video.js elements used by the video pages.
 *
 * The order matters: when a media element (such as `<youtube-video>`) is upgraded, it asks
 * its `<video-player>` to register it only once. When the page is loaded directly, the
 * elements are already in the prerendered HTML, so they are upgraded in the order they are
 * defined here, and the player must be defined first. The blank lines keep editors that
 * organize imports from sorting these.
 */

import '@videojs/html/video/player';

import '@videojs/html/video/skin';

import '@videojs/html/media/youtube-video';
