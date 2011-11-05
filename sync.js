/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Firefox-Herdict Integration Pitch.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Atul Varma <atul@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// This function synchronizes any visual HTML content with the current
// position of audio content. It's a generic function that can be used
// to provide e.g. the visuals for a narrated slide-show, or
// subtitles for a movie.
//
// The options object should contain the following keys, all
// required unless otherwise specified:
//
//   audio        - CSS selector that points to a single HTML5
//                  <audio> element. The visuals will be synchronized
//                  with this.
// 
//   visuals      - CSS selector that points to a collection
//                  of DOM elements, each of which is a visual
//                  to be displayed at some point in the audio.
//                  When the page is first loaded, these elements
//                  shouldn't be visible.
// 
//   visibleClass - Class to add to a visual element when it is
//                  being displayed. CSS should be defined such that
//                  adding this class to a visual element actually
//                  makes it visible. Defaults to "visible".
// 
//   syncAttr     - Attribute name on each visual element that
//                  identifies the time into the audio, in seconds, at
//                  which the visual element it's attached to should
//                  be displayed. Every visual element must have
//                  this attribute, or else an exception will be
//                  thrown when this function is called. Defaults to
//                  "data-at".
function syncVisualsWithAudio(options) {
  var syncInfo = [];
  var audio = $(options.audio).get(0);
  var visuals = $(options.visuals);
  var visibleClass = options.visibleClass || "visible";
  var syncAttr = options.syncAttr || "data-at";

  visuals.each(
    function() {
      var rawTimestamp = $(this).attr(syncAttr);
      var timestamp = parseFloat(rawTimestamp);
      if (isNaN(timestamp))
        throw new Error("bad '" + syncAttr + "' attribute: " +
                        rawTimestamp);
      syncInfo.push({timestamp: timestamp, visual: this});
    });

  // Return the DOM element that should be displayed as the active
  // visual the given number of seconds into the audio.
  function findVisualForTime(timestamp) {
    var bestVisual;

    for (var i = 0; i < syncInfo.length; i++) {
      var info = syncInfo[i];
      if (info.timestamp <= timestamp)
        bestVisual = info.visual;
    }

    return bestVisual;
  }

  // Potentially change the current visual depending on
  // how far we are into the movie.
  function maybeChangeVisual() {
    var visual = findVisualForTime(audio.currentTime);
    if (visual && !$(visual).hasClass(visibleClass)) {
      visuals.removeClass(visibleClass);
      $(visual).addClass(visibleClass);
    }
  }

  audio.addEventListener("timeupdate", maybeChangeVisual, false);
  maybeChangeVisual();
}
