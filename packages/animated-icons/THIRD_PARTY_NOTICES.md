# Third-party notices

Bookmark, BookmarkCheck, BookmarkMinus, BookmarkPlus, BookmarkX, CircleCheck, CircleHelp, BadgeAlert, BadgePercent, and Ban adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

The bookmark outlines scale Y through 1, 1.3, 0.9, 1.05, and 1 while scaling X through 1, 0.9, 1.1, 0.95, and 1 over 600 ms with ease-out per segment. Only the outline stretches. Their marks retain the source's normalized `pathLength="1"`, `stroke-dasharray="1 1"`, and dash-offset reveal from 1 to 0 over 300 ms. BookmarkCheck also fades its mark. The second Plus and X strokes wait 100 ms. Mark returns use Motion's implicit 300 ms curve, cubic-bezier(0.25, 0.1, 0.35, 1). Outline returns use the default scale spring, stiffness 550, damping 30, and rest speed 10.

CircleCheck draws its check over 400 ms and fades it over 100 ms. Return uses 300 ms for the stroke and 100 ms for opacity. CircleHelp rotates only the question-mark group through 0, -10, 10, -10, and 0 degrees over 500 ms with ease-in-out, including its declared return transition. Local SVG origins follow the animated shape's bounding-box center.

BadgeAlert transforms the whole SVG over 500 ms. Its scale has five values and keeps offsets 0, 0.2, 0.4, 0.6, and 1. Its rotation has six values, so Motion ignores the mismatched offsets and distributes rotation evenly. The shared sampler follows that same length check. Its return uses the default rotation and scale springs. The sampler also preserves the initial interrupted pose when a spring considers a tiny scale distance already settled. BadgePercent rotates only its outline to 180 degrees after 100 ms with stiffness 80 and damping 13. Return uses stiffness 60 and damping 10. The declared 500 ms duration does not override the physics parameters.

Ban starts the circle and slash with separate calls on the same controls. The second call's transition override replaces the slash variant's transition. The circle draws over 400 ms and fades over 100 ms with ease-out. The slash waits 500 ms, then draws and fades together over the implicit 300 ms transition with cubic-bezier(0.25, 0.1, 0.35, 1). Both return with the declared 300 ms stroke and 100 ms opacity transitions. The comparison executes the original calls and samples both sides before and after that delay.

The `/bookmarks-status-comparison/` fixture executes all ten pinned React sources at 14, 16, 24, and 28 px. Copied sources change only the class utility import. Native tracks replace upstream JavaScript transforms and normalized path-length animation. Replays preserve the current pose of active tracks rather than resetting to an explicit first keyframe. A completed mark starts a fresh reveal when replayed, even if the outline is still moving. Return comparisons capture seeked reference poses and reset their velocity before the original stop method. Settled returns cover all ten icons; interrupted return comparisons cover CircleCheck, CircleHelp, and Ban. Public adapter tests check real interrupted continuity, replay, cleanup, isolation, and reduced motion. Interrupted spring velocity parity is not measured. Numerical comparisons support manual visual review.

- [Lucide Animated Bookmark, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bookmark.tsx)
- [Lucide Animated BookmarkCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bookmark-check.tsx)
- [Lucide Animated BookmarkMinus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bookmark-minus.tsx)
- [Lucide Animated BookmarkPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bookmark-plus.tsx)
- [Lucide Animated BookmarkX, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bookmark-x.tsx)
- [Lucide Animated CircleCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-check.tsx)
- [Lucide Animated CircleHelp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-help.tsx)
- [Lucide Animated BadgeAlert, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/badge-alert.tsx)
- [Lucide Animated BadgePercent, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/badge-percent.tsx)
- [Lucide Animated Ban, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/ban.tsx)

Play, Pause, Volume, Mic, MicOff, Disc3, Drum, Cast, Airplay, and SwitchCamera adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

Play translates its polygon through 0, -1, 2, and 0 SVG units while rotating through 0, -10, 0, and 0 degrees over 500 ms. Pause moves its rectangles on separate 500 ms tracks. Both use offsets 0, 0.2, 0.5, and 1 with ease-out per segment. Mic moves its capsule through 0, -3, 0, -2, and 0 units over 600 ms with ease-in-out. Their interrupted returns use Motion's default transform spring with stiffness 500, damping 25, and rest speed 10.

MicOff redraws its slash after 150 ms over 400 ms. Its separate 100 ms opacity track has no delay, matching the upstream property transition. Return draws the full slash over 300 ms and restores opacity over 100 ms. Disc3 rotates its two inner arcs to 90 degrees around 12px 12px over 400 ms with ease-in-out and holds. Its circles stay fixed. Drum rotates its sticks through opposing -10, 10, and 0 degree sequences. Each 500 ms cycle reverses on the next iteration, with initial delays of 100 and 200 ms. Stop preserves pose and the sampled direction of velocity before its default transform spring returns to zero.

Cast fades its dot and two waves over 500 ms with 0, 100, and 200 ms delays. Airplay draws its screen with path length 0 to 1 and path offset 1 to 0 over 600 ms with ease-in-out. Its triangle scales through 0.6, 1.1, and 1 with ease-out while fading in. A cancellable sequence waits for entry, then starts the 300 ms ease-out normal phase. SwitchCamera draws four paths over 400 ms with linear easing. The upstream root SVG has animation controls but no transform variants. Its fixed 24 px dimensions become the package's common size prop.

Volume renders the speaker and complete mute cross before JavaScript. Playback completes the outgoing cross's exit before replacing it with the two wave paths. The complete idle cross exits immediately because its target is unchanged. An interrupted partial cross first restores its strokes and opacity over 300 ms. Waves fade in over 300 ms after 100 and 200 ms delays. Stop fades both waves out over 300 ms, then replaces them with the cross. Its two strokes draw and fade in over 300 ms with the same stagger. These transitions use Motion's default curve, cubic-bezier(0.25, 0.1, 0.35, 1). Cancellation prevents pending phases from replacing SVG nodes after removal, replay, or reduced motion. Volume remains decorative playback and exposes no audio or mute state API. The common replay protocol cancels previous tracks on each command. A repeated command for the visible branch therefore settles its current opacity or partial strokes over 300 ms without the previous stagger. The upstream boolean setter ignores repeated commands for an unchanged state. This compatibility adjustment keeps the common playback handle and preserves the current visible pose.

The `/media-comparison/` fixture executes all ten pinned React components at 14, 16, 24, and 28 px. Copied sources change only the class utility import, except SwitchCamera, whose reference also accepts and applies the explicit size prop. React stays in comparison bundles. Entry and captured-return checks compare geometry, opacity, and normalized stroke dashes. Volume comparisons seek each incoming and outgoing branch after the actual React replacement. Drum return comparisons sample its original animation 5 ms before the captured pose to retain velocity, including during a reversed cycle. Other captured returns reset reference velocity before calling the original stop method. The adapter API tests cover real interrupted continuity and cleanup. These measurements support manual visual review.

- [Lucide Animated Play, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/play.tsx)

- [Lucide Animated Pause, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/pause.tsx)

- [Lucide Animated Volume, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/volume.tsx)

- [Lucide Animated Mic, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/mic.tsx)

- [Lucide Animated MicOff, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/mic-off.tsx)

- [Lucide Animated Disc3, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/disc-3.tsx)

- [Lucide Animated Drum, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/drum.tsx)

- [Lucide Animated Cast, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cast.tsx)

- [Lucide Animated Airplay, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/airplay.tsx)

- [Lucide Animated SwitchCamera, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/switch-camera.tsx)

Phone, PhoneCall, PhoneForwarded, PhoneIncoming, PhoneMissed, PhoneOff, MailCheck, Mailbox, Send, and Bell adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

Phone rotates through 10, 20, -10, 10, and 0 degrees and pulses through scale 1, 1.1, and 1 over 900 ms with ease-in-out per segment. PhoneCall uses the same rotation with five scale steps peaking at 1.2. Its waves fade out over 300 ms, then return with stiffness 300 and damping 20 after 200 and 100 ms delays. The existing signal sampler combines both phases into cancellable native tracks, so stop, removal, or reduced motion cannot start a late reveal. Native opacity springs normalize to 100 and retain the fade completion velocity. Phone and PhoneCall return with Motion's default rotation and scale springs.

PhoneForwarded pulses the whole SVG over 900 ms. Its arrowhead moves through x=0, 3, and 0 over 500 ms. The shaft also scales through 1, 0.85, and 1 around its right endpoint. PhoneIncoming pulses its handset to 1.1 over 900 ms while its arrow scales to 1.2 and moves by -1, 1 SVG units over 800 ms. PhoneMissed pulses its handset to 1.05 and its cross to 1.2. The upstream handset variants contain `initial` but omit `normal`, although stop requests `normal`. Both adapters explicitly return the handset to scale 1 with Motion's default scale spring. Their other shapes use the upstream return springs. Interrupted replays preserve the current transform instead of resetting to the first explicit keyframe.

PhoneOff draws its slash over 400 ms with linear easing. MailCheck draws its check and reveals opacity over 400 ms with ease-in-out. Native stroke dashes replace normalized path lengths. Mailbox rotates its flag to -90 degrees around SVG point 18, 11 with stiffness 280 and damping 12, then holds. Return uses stiffness 300 and damping 18. Bell rotates the whole SVG through 0, -10, 10, -10, and 0 degrees over 500 ms with ease-in-out. Its origin is the SVG center, rather than the bell path's bounding-box center.

Send moves its plane by 3, -3 SVG units and scales it to 0.8 over 500 ms, then holds. Its decorative trail reveals stroke length and opacity over 550 ms after a 100 ms delay. The plane remains complete before JavaScript; the trail remains hidden, matching the upstream idle state. The source's path-length animation overrides its declared dashed stroke. The adapter preserves that normalized stroke behavior. Return moves the trail by -3, 3 units and hides it over 300 ms. Cleanup restores its hidden SVG attributes.

The `/communication-comparison/` fixture executes all ten original pinned React sources at 14, 16, 24, and 28 px. The copied sources change the class utility import. Mailbox also places its declared `18px 11px` origin in `initial` and uses `transformBox: "view-box"`. Without that correction, Motion overwrites the source style with the path center at 16.5, 10. The adapter and corrected reference use the requested flag hinge at 18, 11; the numerical comparison therefore measures this intentional correction. The runner normalizes PhoneIncoming, PhoneMissed, and PhoneOff's fixed 24 px dimensions after mounting. All adapters honor the common size prop. React remains confined to comparison pages. PhoneCall's asynchronous fade and spring phases are measured separately. Return comparisons capture the completed entry pose and reset reference velocity before stopping, because native stop otherwise samples wall time after seeking. Adapter tests check interrupted pose continuity and cleanup. Numerical equality during real interrupted spring playback and manual visual acceptance remain outside those measurements.

- [Lucide Animated Phone, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/phone.tsx)
- [Lucide Animated PhoneCall, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/phone-call.tsx)
- [Lucide Animated PhoneForwarded, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/phone-forwarded.tsx)
- [Lucide Animated PhoneIncoming, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/phone-incoming.tsx)
- [Lucide Animated PhoneMissed, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/phone-missed.tsx)
- [Lucide Animated PhoneOff, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/phone-off.tsx)
- [Lucide Animated MailCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/mail-check.tsx)
- [Lucide Animated Mailbox, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/mailbox.tsx)
- [Lucide Animated Send, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/send.tsx)
- [Lucide Animated Bell, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bell.tsx)

CornerDownLeft, CornerDownRight, CornerLeftDown, CornerLeftUp, CornerRightDown, CornerRightUp, CornerUpLeft, CornerUpRight, Expand, and Shrink adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

The eight corner icons pulse their root SVG over 450 ms with ease-in-out per segment. Horizontal arrows scale X through 1, 1.15, and 1, with translation through 0, -2 or 2, and 0 CSS pixels. Vertical arrows apply the same values on Y. Root SVG transforms preserve the upstream viewport center and CSS-pixel translation at 14, 16, 24, and 28 px. Return uses Motion's default translation spring with stiffness 500 and damping 25, and scale spring with stiffness 550 and damping 30. Both use rest speed 10. Completed pulses restore the drawing. Interrupted replays preserve the current adapter pose, while upstream keyframe arrays restart at rest.

Expand translates its four paths outward by 2 SVG units on each axis. Shrink translates its four paths inward by 1 unit. Both hold their final pose and use stiffness 250 and damping 25 for entry and return. The shared SVG sampler preserves pose and sampled velocity on interruption, and the existing lifecycle cancels all tracks and clears retained state on removal or reduced motion. The only extension to that sampler is scaleX support.

The `/corner-resize-comparison/` fixture executes all ten pinned React sources at explicit sizes 14, 16, 24, and 28 px. Copied sources change only the class utility import to `../utils`. Entry measurements sample 0 through 1000 ms. Return measurements start after completed entry with reference velocity reset, so Expand and Shrink return from their held pose while corner pulses are already at rest. Public adapter tests cover interrupted stop continuity and replay. Numerical equivalence of real interrupted spring velocity is unverified. Automated geometry and paint measurements support the user's manual visual acceptance. React remains confined to comparison pages.

- [Lucide Animated CornerDownLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/corner-down-left.tsx)
- [Lucide Animated CornerDownRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/corner-down-right.tsx)
- [Lucide Animated CornerLeftDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/corner-left-down.tsx)
- [Lucide Animated CornerLeftUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/corner-left-up.tsx)
- [Lucide Animated CornerRightDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/corner-right-down.tsx)
- [Lucide Animated CornerRightUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/corner-right-up.tsx)
- [Lucide Animated CornerUpLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/corner-up-left.tsx)
- [Lucide Animated CornerUpRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/corner-up-right.tsx)
- [Lucide Animated Expand, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/expand.tsx)
- [Lucide Animated Shrink, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/shrink.tsx)

CloudBackup, CloudCog, CloudDownload, CloudLightning, CloudRainWind, CloudRain, CloudSnow, CloudSun, CloudSync, and CloudUpload adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`.

CloudBackup and CloudSync rotate their inner groups to -360 degrees over 800 and 1200 ms with ease-in-out, then hold. They return over the same duration. The shared group transform recipe also preserves FolderSync's existing behavior. CloudCog shares the existing cog spring to 180 degrees with stiffness 50 and damping 10. CloudDownload and CloudUpload move their arrow groups by 2 and -2 SVG units over 300 ms with cubic-bezier(0.68, -0.6, 0.32, 1.6), then hold. Their returns use the same curve. These transfer curves differ from Download and Upload's springs.

CloudLightning loops opacity through 1, 0.4, and 1 every second. CloudRain and CloudRainWind loop through 1, 0.2, and 1 every second, with 200 ms between strokes in source order. CloudSnow loops through 1, 0.3, and 1 every 1500 ms, with 300 ms between its six flakes. Native opacity tracks preserve the source's global ease-in-out curve and initial delay. Return removes the stagger and restores opacity over 300 ms with Motion's default curve (0.25, 0.1, 0.35, 1). Cancellation removes delayed and infinite tracks without phased callbacks.

CloudSun moves its cloud through -1, 1, -1, 1, and 0 units on both axes over one second with ease-in-out per segment. Its five sun strokes fade from zero to one over 300 ms, starting at 100 ms intervals. The explicit upstream duration selects ease-out for entry; return uses the default opacity curve without delay. The cloud returns with stiffness 500, damping 25, and rest speed 10. Native transform samples preserve pose and velocity on stop. CloudRain and CloudRainWind use the common 28 px default size rather than the upstream 24 px default. All drawings are complete before JavaScript runs.

The `/cloud-comparison/` fixture executes all ten pinned React sources at 14, 16, 24, and 28 px. Their only source change is the local class utility import. React remains confined to comparison pages. The return measurement captures the pose at 3250 ms and resets reference velocity before calling the original stop method. This avoids Motion's native stop sampler replacing a seeked opacity with its wall-clock estimate. It measures return from a captured pose, not numerical equality during real interrupted playback. Recipe tests check interrupted stop continuity, replay, removal, and reduced motion through the public adapter API. JavaScript spring velocity during a real interruption remains outside the numerical reference comparison.

- [Lucide Animated CloudBackup, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-backup.tsx)
- [Lucide Animated CloudCog, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-cog.tsx)
- [Lucide Animated CloudDownload, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-download.tsx)
- [Lucide Animated CloudLightning, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-lightning.tsx)
- [Lucide Animated CloudRainWind, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-rain-wind.tsx)
- [Lucide Animated CloudRain, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-rain.tsx)
- [Lucide Animated CloudSnow, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-snow.tsx)
- [Lucide Animated CloudSun, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-sun.tsx)
- [Lucide Animated CloudSync, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-sync.tsx)
- [Lucide Animated CloudUpload, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/cloud-upload.tsx)

MapPinCheckInside, MapPinCheck, MapPinHouse, MapPinMinusInside, MapPinMinus, MapPinOff, MapPinPlusInside, MapPinPlus, MapPinXInside, and Compass adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`. Each pin moves its whole SVG through y=0, -5, and -3 CSS pixels over 500 ms, with the peak at 300 ms and ease-out per segment. Symbols reveal after 300 ms over 300 ms, except Plus and X strokes, which draw over 200 ms with delays of 300 and 600 ms. Opacity reveals over 100 ms with the same per-property delay. MapPinPlusInside draws its horizontal stroke first despite the upstream variant names; MapPinPlus draws its vertical stroke first. Native stroke dashes replace normalized path lengths.

Pin returns use the upstream default translation spring (stiffness 500, damping 25, rest speed 10) and 300 ms opacity curve (0.25, 0.1, 0.35, 1). The upstream normal variants omit path length. Interrupted returns preserve the partial stroke until the package lifecycle restores the complete drawing after return; upstream retains it. Interrupted root replays preserve their current position, while the upstream keyframe array restarts at zero. Symbol replays restart their explicit zero-to-one keyframes.

Compass rotates only its polygon to 360 degrees using stiffness 120 and damping 15. Its origin is the polygon's bounding-box center (12, 12). The shared sampler preserves pose and velocity during interruption. Its circle remains fixed. These ten adapters use the existing rendering, lifecycle, input, and reduced-motion behavior.

The `/map-compass-comparison/` fixture executes all ten original pinned React components at 14, 16, 24, and 28 px. Copied sources change only the class utility import. React stays out of consumer bundles. Numerical entry and completed-pose return comparisons use the existing React track seeker. Interrupted JavaScript spring returns cannot be synchronized numerically through this seeker because seeking does not update Motion value velocity; adapter tests cover pose continuity and cleanup instead.


AlarmClock, AlarmClockCheck, AlarmClockMinus, AlarmClockPlus, Clock, Timer, Hourglass, History, CalendarCheck, and CalendarCheck2 adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`. The four alarms repeat the upstream six horizontal keyframes every 300 ms with linear easing. Body parts use amplitude 1 and lift -1.5; bells use amplitude 2 and lift -2.5. Separate nested groups let each axis use its own timing. Lift and return use stiffness 200 and damping 25. The physics override the declared 200 ms duration. Interrupted replay replaces the first horizontal keyframe with the captured pose; subsequent iterations of that playback reuse it. Returning carries the current velocity into both springs. The shared lifecycle cancels infinite tracks, pending completions, and sampled state on removal or reduced motion.

Clock shares FolderClock's hand mechanism. History reverses those hand rotations and rotates its separate arrow group to -50 degrees with stiffness 250 and damping 25. Hourglass rotates its group to 180 degrees with stiffness 100 and damping 15. Timer rotates its hand to 300 degrees over 600 ms after a 100 ms delay. Its centered button scales from 0.9 to 1 and moves through y=0, 1, 0 over 300 ms. Its return uses Motion's separate default translation and scale springs. Both calendar checks reveal stroke and opacity over 400 ms with ease-in-out, then return over 300 ms with the default cubic Bezier curve. Native stroke dash lengths replace normalized path lengths. Interrupted replay preserves the current transform, stroke, and opacity.

The `/clock-calendar-comparison/` fixture executes all ten pinned React sources at 14, 16, 24, and 28 px. The copied sources change only the class utility import. React remains confined to comparison pages. At exact alarm loop boundaries, native Web Animations samples the next iteration's first frame while the upstream JavaScript sampler returns the previous iteration's final frame. Numerical comparisons sample 1 ms before and after these boundaries. The fixture records the compatibility adjustments for manual visual review.

The ten chart components adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`. ChartBarDecreasing, ChartBarIncreasing, ChartColumnDecreasing, ChartColumnIncreasing, ChartNoAxesColumnDecreasing, and ChartNoAxesColumnIncreasing hide their bars over 300 ms with 100 ms between bars, wait for all bars to finish, then reveal them with the same timing and ease-out curve. Native stroke dashes replace normalized path lengths. Both awaited phases share cancellable tracks, which prevent a queued redraw after stop, removal, or reduced motion. Restarting these cycles begins from the current pose.

ChartLine and ChartSpline reuse the staggered path reveal mechanism. Their stroke reveals after 150 ms over 300 ms with ease-out. Their property-specific opacity transition overrides the root duration and uses Motion's default 300 ms curve (0.25, 0.1, 0.35, 1) after 100 ms. Their explicit zero-to-one entry keyframes restart the reveal on replay. ChartScatter fades all five points out over 200 ms, then reveals them in source order with 150 ms between points and 300 ms ease-out transitions. Returns restore stroke length and opacity over 300 ms with the default curve and no delay.

ChartPie moves its sector by (1.1, -1.1) SVG units using stiffness 250 and damping 15, preserving velocity on interruption. Those physical parameters override the source's bounce value. The existing transform sampler replaces the React transforms, with the same spring on return. The complete initial SVG, common props, hover, manual playback, reduced motion, and cleanup use the shared package lifecycle.

The chart comparison fixture at `/charts-comparison/` executes all ten pinned React components at 14, 16, 24, and 28 px. Its vendored sources change only the class utility import to the local equivalent. The upstream asynchronous sequences require measuring the hide and reveal phases separately. React stays confined to comparison fixtures.

The ten MessageCircle and MessageSquare components, including their Check, More, Plus, and X variants, adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`. Circle and square variants share matching recipes. The simple bubbles rotate through 0, -7, 7, and 0 degrees over 500 ms with ease-in-out per segment. Their scale springs to 1.05 with stiffness 400 and damping 10, then holds until stopped. Return uses Motion's default scale spring (stiffness 550, damping 30) and rotation spring (stiffness 500, damping 25), carrying interrupted velocity. Nested groups with SVG origin (12, 12) replace the upstream SVG transforms.

Message checks reveal opacity and stroke length over 400 ms with ease-in-out. They share the existing UserCheck reveal mechanism. Plus and X variants reveal their second stroke after 200 ms. Return removes that delay and restores both properties over 300 ms with Motion's default cubic Bezier curve (0.25, 0.1, 0.35, 1). Native stroke dash lengths replace normalized path lengths. The More variants run the original eight opacity keyframes over 1.5 seconds with per-dot offsets, then hold fully visible. The upstream native opacity animation uses a global ease-out curve. Their return uses the default 300 ms opacity transition.

The message adapters use the package's complete initial SVG, props, manual playback, input handling, reduced-motion policy, and cleanup. The comparison fixture at `/messages-comparison/` executes the pinned React components at 14, 16, 24, and 28 px. Those reference sources change only the class utility import to a local equivalent. React is confined to the comparison fixture.

ArrowLeft uses Lucide geometry derived from Feather. Its motion adapts Lucide Animated's ArrowLeft recipe. The arrowhead translates three SVG units to the right while the shaft shortens, then both return over 400 ms. This implementation animates the shaft's stroke dash instead of morphing its path. The visible endpoints follow the reference and the rounded caps keep their shape. The implementation uses Motion's vanilla browser APIs.

MapPin uses Lucide geometry and adapts Lucide Animated's MapPin recipe. The whole SVG moves through y=0, -5, and -3 px over 500 ms. The inner circle reveals after 300 ms through opacity and stroke dash animations. Native dash lengths represent the source's normalized path length and path offset.

Copy uses Lucide geometry and adapts Lucide Animated's Copy recipe. Its front rectangle translates by -3 on both axes and its back path by +3, using a spring with stiffness 160, damping 17, and mass 1. The shapes hold until stopped, then return with the same spring.

Check uses Lucide geometry derived from Feather and adapts Lucide Animated's Check recipe. Opacity reveals over 100 ms while path length grows from zero to one and scale grows from 0.5 to one over 400 ms. Returning restores the complete drawing over 300 ms with a 100 ms opacity transition. Native stroke dash lengths replace the source's normalized path length, and the path scales around its bounding-box center. These icons use Motion's vanilla browser APIs.

ArrowDown uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated ArrowDown recipe at commit 4662fff2b60fdcf4751b32013606756caf7c4c26. The head translates through y=0, -3, and 0 while the shaft retracts from 14 to 9 units and back over 400 ms. Native stroke dashes preserve the fixed top endpoint, stroke thickness, and rounded caps. Interrupted returns use the source's default spring for the head and a 300 ms transition for the shaft. Motion's vanilla spring generator supplies native transform keyframes with sampled entry velocity.

Archive uses Lucide geometry and adapts Lucide Animated's Archive recipe pinned to commit `4662fff2b60fdcf4751b32013606756caf7c4c26`. Its lid rises by 1.5 SVG units with stiffness 200 and damping 25. The physics override the declared 200 ms duration. The body and handle morph over 300 ms with Motion's default cubic Bezier curve `[0.25, 0.1, 0.35, 1]`. Entry and return use the same transitions. The vanilla Motion API interpolates the path strings and preserves the lid's velocity during interruption.

AtSign uses Lucide geometry derived from Feather and adapts Lucide Animated's pinned AtSign recipe. Its circle reveals over 300 ms with a full-length negative dash offset returning to zero. The outer path reveals after a 300 ms delay. Returning restores the circle over 400 ms and preserves the outer path's 300 ms delay and 300 ms duration. Both shapes use a 100 ms opacity transition. Native stroke dash lengths replace normalized path values.

ArrowRight uses Lucide geometry derived from Feather and adapts Lucide Animated's pinned ArrowRight recipe. Its head moves through x=0, -3, and 0 while its shaft shortens from 14 to 9 units and returns in 400 ms. Each segment uses ease-out. Returning uses a 300 ms shaft tween and a head spring with stiffness 500, damping 25, mass 1, and rest speed 10. Native stroke dashes preserve rounded caps. The spring is sampled in SVG units to carry interruption velocity into native keyframes, driven by Motion's vanilla browser API.

ArrowUp uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated ArrowUp recipe. Its head moves through y=0, 3, and 0 while the shaft's upper endpoint moves from y=5 to y=10 and back in 400 ms. Native stroke dash lengths replace path morphing and retain the fixed lower endpoint and rounded caps. Entry uses the upstream implicit ease-out curve per segment. Interrupted return uses the default transform spring for the head and the default 300 ms path easing for the shaft. It shares the directional animation helper with ArrowLeft and the existing Web Component lifecycle.

ArrowUpLeft uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated ArrowUpLeft recipe. Its three paths move as one group through scale 1, 0.85, 1 and translation (0, 0), (4, 4), (0, 0) over 500 ms with ease-in-out. An explicit SVG origin at (7, 7) reproduces the source's top-left fill-box origin. Interrupted return samples Motion's default translation and scale springs with inherited velocity into native transform keyframes.

FileText uses Lucide geometry and adapts the pinned Lucide Animated FileText recipe. The whole SVG scales to 1.05 over 300 ms with ease-out. Three text paths shrink and redraw over 700 ms, with delays of 300, 500, and 700 ms and ease-out per segment. Native stroke dashes replace normalized path lengths. The upstream x1 and x2 attributes do not affect path geometry. Returning uses a scale spring with stiffness 550, damping 30, mass 1, rest speed 10, and inherited velocity. The text returns over 300 ms without delay. The shared lifecycle cancels delayed tracks on removal or reduced motion.

Bot uses Lucide geometry and adapts the pinned Lucide Animated Bot recipe. Both eyes blink once after a 200 ms delay, over 500 ms with ease-in-out per segment. Centered stroke dashes reproduce y1=13,14,13 and y2=15,14,15 while retaining the round dot at the closed midpoint. Returning uses the upstream default 300 ms tween with cubic Bézier (0.25, 0.1, 0.35, 1), without a delay. It reuses the shared Web Component lifecycle, CSS, and Motion's vanilla browser API.

ArrowUpRight uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated ArrowUpRight recipe. The complete arrow scales through 1, 0.85, and 1 while translating through (0, 0), (-4, 4), and (0, 0) in SVG units over 500 ms, with ease-in-out on each segment. The explicit SVG origin (17, 7) matches the upstream group's top-right bounding-box corner. Interrupted return retains velocity and uses the default scale spring (stiffness 550, damping 30) and translation springs (stiffness 500, damping 25). Motion's spring generators are sampled into native transform keyframes.

AttachFile uses the pinned Lucide Animated AttachFile drawing and recipe. After a 100 ms delay, opacity reveals over 100 ms and path length reveals over 400 ms with ease-out. The complete drawing stays visible until stopped. Return uses a 300 ms tween with cubic Bézier (0.25, 0.1, 0.35, 1). Native stroke dash lengths replace normalized path length. The implementation uses Motion's vanilla browser API and the shared Web Component lifecycle.

AudioLines uses Lucide geometry and adapts the pinned Lucide Animated AudioLines recipe. Four inner lines loop with periods of 1.5, 1, 0.8, and 1.5 seconds while the outer lines stay fixed. Native stroke dash lengths and offsets reproduce the source's endpoints and rounded caps. Each half-cycle uses ease-out. Returning uses the default 300 ms path curve. Removal and reduced motion restore the complete normal drawing through the shared lifecycle.

Home uses Lucide geometry and adapts Lucide Animated's Home recipe pinned to commit `4662fff2b60fdcf4751b32013606756caf7c4c26`. The outer house stays fixed while the door reveals over 600 ms, with opacity revealing over 200 ms. Entry and return use ease-out and the same durations. Native stroke dash lengths replace normalized path length. Home shares its path reveal mechanism with AttachFile and uses the existing Web Component lifecycle and Motion's vanilla browser API.

The 17 chevron variants adapt Lucide Animated's drawings and recipes at commit `4662fff2b60fdcf4751b32013606756caf7c4c26`. ChevronDown, ChevronLeft, ChevronRight, ChevronUp, and their CircleChevron and SquareChevron variants move two SVG units and return over 500 ms, with the peak at 200 ms and ease-out per segment. Their surrounding circle or square stays fixed. Interrupted returns use a 500 ms ease-out tween from the current pose.

ChevronFirst moves through x=-2, 1, -1, and 0 over 600 ms with offsets 0, 0.3, 0.7, and 1 and ease-in-out per segment. Its vertical bar stays fixed. Return uses a 300 ms ease-out tween. ChevronsDownUp, ChevronsLeftRight, ChevronsRightLeft, and ChevronsUpDown move their two paths by opposing two-unit translations with stiffness 250 and damping 25. They hold their final pose until stopped. Motion's spring generator supplies native keyframes in SVG units and preserves sampled velocity during interruption. All variants reuse the shared lifecycle and reduced-motion behavior.

The 15 Git-related icons adapt Lucide Animated's drawings and recipes at commit `4662fff2b60fdcf4751b32013606756caf7c4c26`. They include FolderGit, FolderGit2, GitBranch, GitCommitHorizontal, GitCommitVertical, GitCompareArrows, GitCompare, GitFork, GitGraph, GitMerge, GitPullRequestClosed, GitPullRequestCreate, GitPullRequest, Github, and Gitlab. Native stroke dash lengths and offsets replace normalized path values. They reuse the shared lifecycle, rendering, CSS, and reduced-motion behavior.

The branch, comparison, fork, graph, merge, and pull-request drawings reveal nodes and edges in 300 ms stages, with delays starting at 100 ms. Edges with a path offset draw from a negative full-length dash offset toward zero. Opacity uses Motion's default 300 ms cubic Bezier `(0.25, 0.1, 0.35, 1)`, independently of the path's ease-out transition. Return uses the default 300 ms curve without delay. GitCompareArrows retains its 400 ms opacity delay on returning arrowheads, as specified by its normal variant. GitPullRequestClosed finishes its final node at 1600 ms.

GitCommitHorizontal, GitCommitVertical, and FolderGit reveal three shapes with 150 ms path delays and 100 ms opacity delays per stage. GitCommitHorizontal and GitCommitVertical use the default 300 ms curve for both properties. FolderGit uses ease-out for the path and the default curve for opacity. FolderGit and FolderGit2 keep their folder outlines fixed. Gitlab reveals its outline over 700 ms after a 100 ms delay; opacity takes 300 ms. Its return uses the default 300 ms transition.

Github reveals and scales its body from 0.9 to 1 over 400 ms. Its tail draws over 500 ms, then rotates through 0, -15, 15, -10, 10, -5, and 5 degrees in a repeating 2500 ms cycle, with ease-in-out per segment. Both paths use their bounding-box centers as transform origins. Stop returns from the current pose over 300 ms with ease-out. Cancellation prevents a queued draw completion from starting another loop.

The Git comparison fixture uses independent native keyframes and normalized stroke lengths, without executing the upstream React components. Browser tests compare entry and interrupted returns at 14, 16, 24, and 28 px. Github's tail angles and loop cancellation are checked separately.

Grip, GripHorizontal, and GripVertical adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26` and use Lucide circle geometry. Grip fades nine circles through opacity 1, 0.3, 0.3, and 1 over 1100 ms at offsets 0, 0.2, 0.8, and 1, with 70 ms between circles and ease-out per segment. GripHorizontal and GripVertical pulse six circles through opacity 1, 0.4, and 1 and scale 1, 0.85, and 1 over 1000 ms with ease-in-out. Their delays are 0, 150, 300, 250, 400, and 550 ms in source order. Each circle scales around its own center. Interrupted returns use a 250 ms ease-out tween without delays. All three restore the drawing after entry and reuse the shared lifecycle, input, and reduced-motion behavior. Replaying restarts the sequence, following this package's playback contract rather than the upstream reentry guard. Motion's vanilla browser API supplies native opacity and transform tracks.

The 24 folder variants adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26` and use Lucide geometry. Native stroke dashes reproduce progressive drawing and path offsets, including separate opacity timings and delayed returns. Native transform keyframes sample the source tweens and springs in SVG units and preserve interruption velocity. FolderHeart, FolderKanban, FolderKey, FolderLock, and FolderRoot loop until stopped. The shared lifecycle restores each initial drawing on disconnection or reduced motion. The comparison fixture at `/folders-comparison/` runs the original React components at 14, 16, 24, and 28 px. Its vendored sources under `tests/fixtures/astro/src/references/folders/` change only the class utility import. React remains a test fixture dependency.

Sun uses the pinned Lucide Animated drawing and recipe. Its eight rays fade in clockwise, each over 300 ms with delays from 100 to 800 ms and Motion's default curve. The center stays visible. Returning restores ray opacity over 300 ms without delay. It reuses the staggered reveal recipe and holds the complete drawing until stopped.

Moon uses Lucide geometry derived from Feather and adapts the pinned Lucide Animated recipe. The drawing rotates through 0, -10, 10, -5, 5, and 0 degrees over 1200 ms with ease-in-out per segment around the SVG center (12, 12). Returning starts from the current pose and uses a 1200 ms ease-in-out tween. Completed playback restores the drawing.

Monitor uses the Lucide drawing pinned to commit `66de90d63e5e26d867a4391bd607fd7a3bbe17fd`, derived from Feather. Lucide Animated has no plain Monitor recipe at the revision used here. This package's recipe reuses the shared blink mechanism: screen opacity moves through 1, 0, and 1 over 600 ms with ease-in-out, while the stand stays fixed. Returning restores screen opacity over 300 ms with Motion's default curve.

Linkedin uses the pinned Lucide Animated drawing and recipe. Its path, rectangle, and circle reveal together over 600 ms with linear path length and reverse-offset transitions. Opacity reveals over 100 ms with Motion's default curve. Returning restores the complete drawing over 400 ms with a 100 ms opacity transition. Native SVG stroke dashes replace normalized path length and offset.

The seven user icons adapt Lucide Animated drawings and recipes pinned to commit `4662fff2b60fdcf4751b32013606756caf7c4c26`: User, UserCheck, UserPlus, UserRoundCheck, UserRoundCog, UserRoundPlus, and Users. They reuse the shared rendering, lifecycle, input, and reduced-motion behavior.

User redraws its head with a reverse stroke offset and a scale spring (stiffness 550, damping 30, rest speed 10). Its body redraws over 400 ms after a 200 ms delay, including on return. UserCheck and UserRoundCheck share a 400 ms ease-in-out check reveal and a 300 ms return with Motion's default curve. UserPlus scales and rotates its plus after 250 ms, with keyframes at 0, 70, and 100 percent of a 450 ms ease-out transition. It returns over 300 ms. The zero-scale entry preserves the pinned recipe.

UserRoundCog rotates its cog by 180 degrees over 300 ms with ease-out. The upstream spring settings are nested inside a second transition object, which selects Motion's fallback tween instead of configuring a spring. This adapter honors the package size prop; the upstream SVG forces 24 px. Users slides its two right-hand paths from x=-6 to zero after 100 ms using stiffness 200 and damping 13. Spring sampling retains velocity during interruption.

UserRoundPlus draws its vertical and horizontal bars after 300 and 600 ms, with 200 ms path transitions and 100 ms opacity transitions. Its upstream normal variant restores only opacity. An interrupted return keeps the partial stroke during that 300 ms opacity transition, then the shared lifecycle restores the complete drawing. The upstream component retains the partial stroke. The comparison fixture runs the pinned React components, with a local class utility import and UserRoundCog dimensions changed to the requested size.

The ten navigation and history icons adapt Lucide Animated drawings and recipes pinned to commit `4662fff2b60fdcf4751b32013606756caf7c4c26`: Login, Logout, RefreshCw, RefreshCcw, RotateCw, RotateCcw, Undo, Redo, UndoDot, and RedoDot. They reuse the common rendering, playback, input, and reduced-motion behavior.

Login and Logout combine the upstream x offset (-2 or 2 units) with a three-keyframe translateX excursion (0, 3, 0 or 0, -3, 0) over 400 ms with ease-out per segment. Their upstream recipes have no normal variant. This adapter returns both translations to zero over 400 ms from the current pose, then clears retained styles. The public Login name follows this package's naming, while the upstream component is named LogInIcon.

RefreshCw, RefreshCcw, RotateCw, and RotateCcw rotate to 50 or -50 degrees with stiffness 250 and damping 25, then hold. They do not loop. The adapter rotates the inner drawing around viewBox center (12, 12), matching the upstream SVG or group rotation. The shared spring sampler preserves pose and velocity when interrupted. Public handle names use the package's Cw and Ccw spelling and correct the upstream RefreshCW handle typo.

Undo, Redo, UndoDot, and RedoDot animate for 600 ms with cubic-bezier(0.25, 0.1, 0.25, 1) per segment. The arrowhead moves by ±2.1 horizontally and -1.4 vertically, rotates by ±12 degrees, then returns. The arc shortens from full length to 80 percent and back. Dot variants scale their dot through 1, 1.2, and 1. SVG stroke dashes replace normalized pathLength. Returns use the same duration and easing from the current pose. Login, Logout, and the four history recipes also begin interrupted replays from the current pose, including the current arc length and dot scale. Their upstream keyframe arrays restart at a fixed initial pose. The comparison fixture runs all ten pinned React components at 14, 16, 24, and 28 px; only their class utility imports point to a local equivalent.

The ten document and transfer icons adapt Lucide Animated revision `4662fff2b60fdcf4751b32013606756caf7c4c26`: Download, Upload, ClipboardCheck, Delete, FileCheck, FileCheck2, FilePenLine, FileCog, FileStack, and FileChartLine. They reuse the common props, rendering, input handling, lifecycle, and reduced-motion behavior. The comparison fixture at `/documents-comparison/` executes the pinned React components at 14, 16, 24, and 28 px. The class utility import points to a local equivalent; FileCog's fixed 28 px dimensions are changed to the requested size in the reference.

Download and Upload share a transfer recipe and move their arrow by two units with stiffness 200 and damping 10. Their return uses Motion's default translation spring, stiffness 500, damping 25, and rest speed 10. Delete lifts its lid by 1.1 units and lowers its body and bars by one and half a unit, using stiffness 500 and damping 30. The body morph in the source is a translation of every point by one unit; the adapter uses that equivalent translation.

FileCheck and FileCheck2 reuse the shared 400 ms check reveal and 300 ms return. ClipboardCheck uses a 300 ms reveal. The source hides ClipboardCheck's check initially and on return. The adapter keeps it visible at rest and restores its opacity during return to preserve the complete-drawing contract.

FilePenLine repeats its 500 ms pen movement once and extends its line from one to five units over 500 ms. The adapter interpolates the same path through CSS `d`, so native animation seeking and cancellation remain available. Its return uses Motion's default translation and rotation springs. Shared transform sampling preserves the current pose when stopping within a repeated iteration.

FileCog shares FolderCog's rotation recipe, turning its cog by 180 degrees with stiffness 50 and damping 10. Its adapter honors the package's size prop. FileStack moves its top and bottom sheets together using Motion's default translation springs. FileChartLine reveals its chart over 300 ms after a 150 ms delay, with opacity beginning after 100 ms. All ten hold their completed entry pose until stopped; returning restores the complete initial drawing.

The ten security icons adapt Lucide Animated drawings and recipes pinned to commit `4662fff2b60fdcf4751b32013606756caf7c4c26`: Lock, LockOpen, LockKeyhole, LockKeyholeOpen, Key, KeyCircle, KeySquare, ShieldCheck, Fingerprint, and ScanFace. They reuse the package's rendering, props, manual playback, input handling, lifecycle, and reduced-motion policy. The comparison fixture at `/security-comparison/` executes all ten pinned React components at 14, 16, 24, and 28 px. Only their class utility imports point to a local equivalent. React stays in the comparison fixture.

The four locks combine root SVG rotation and scale keyframes over one second with a 300 ms shackle transition, using cubic-bezier(0.4, 0, 0.2, 1). Closed locks shorten the shackle to 70 percent. Open locks start and return at 80 percent, extending to full length during playback. A normalized SVG pathLength and stroke dash preserve that open drawing before JavaScript runs. Root keyframe replays start at the current pose, including held poses. Shackle transitions also start at the current pose. The upstream root keyframe arrays restart at a fixed first pose.

Key rotates through -3, -33, -25, and -28 degrees over 600 ms at offsets 0, 0.6, 0.8, and 1, with ease-in-out. Its SVG origin is 30 percent across and 70 percent down. Return uses stiffness 120 and damping 14. KeyCircle bounces vertically through 0, -3, 0, -2, and 0 CSS pixels while rotating through 0, 3, -3, and 0 degrees over 900 ms. KeySquare rotates through 0, 15, -15, and 0 degrees and scales through 1, 1.05, 1, and 1 over 600 ms. Their bounce fields do not select springs for these keyframe arrays. Both use the source's default ease-out curve. Root SVG transforms preserve their CSS-pixel translation and center origins at every size. Replays preserve the current pose, including Key's held -28-degree rotation.

ShieldCheck shares Check's stroke, scale, and opacity mechanism. Its stroke and scale reveal over 400 ms, opacity reveals over 100 ms, and return takes 300 ms. ShieldCheck uses ease-out. Fingerprint keeps nine faint base paths visible while its nine foreground paths reveal through lengths 0.1, 0.3, 0.5, 0.7, 0.9, and 1 over two seconds, with ease-out per segment. Foreground opacity uses the source's five keyframes over 500 ms with the native ease-out curve. Native stroke dashes replace normalized foreground lengths. Replays of interrupted reveals preserve the current stroke, scale, and opacity.

ScanFace runs the source's hidden phase before its visible phase. The root scales to 0.9; corners scale to 1.2, rotate 45 degrees, and fade with stiffness 200 and damping 20. The mouth scales to 0.8 and fades over 300 ms after a 100 ms delay. Return uses Motion's default scale and rotation springs and 300 ms opacity transition. A cancellable phase barrier waits for every hidden track before starting the visible phase. Stop, replay, disconnection, and reduced motion invalidate the pending phase, so a late completion cannot restart playback. Native transform keyframes sample springs in their original property units and retain interruption velocity.

Sources:

- [Lucide Animated Lock, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/lock.tsx)
- [Lucide Animated LockOpen, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/lock-open.tsx)
- [Lucide Animated LockKeyhole, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/lock-keyhole.tsx)
- [Lucide Animated LockKeyholeOpen, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/lock-keyhole-open.tsx)
- [Lucide Animated Key, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/key.tsx)
- [Lucide Animated KeyCircle, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/key-circle.tsx)
- [Lucide Animated KeySquare, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/key-square.tsx)
- [Lucide Animated ShieldCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/shield-check.tsx)
- [Lucide Animated Fingerprint, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/fingerprint.tsx)
- [Lucide Animated ScanFace, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/scan-face.tsx)

- [Lucide Animated FolderGit, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-git.tsx)
- [Lucide Animated FolderGit2, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-git-2.tsx)
- [Lucide Animated GitBranch, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-branch.tsx)
- [Lucide Animated GitCommitHorizontal, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-commit-horizontal.tsx)
- [Lucide Animated GitCommitVertical, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-commit-vertical.tsx)
- [Lucide Animated GitCompareArrows, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-compare-arrows.tsx)
- [Lucide Animated GitCompare, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-compare.tsx)
- [Lucide Animated GitFork, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-fork.tsx)
- [Lucide Animated GitGraph, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-graph.tsx)
- [Lucide Animated GitMerge, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-merge.tsx)
- [Lucide Animated GitPullRequestClosed, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-pull-request-closed.tsx)
- [Lucide Animated GitPullRequestCreate, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-pull-request-create.tsx)
- [Lucide Animated GitPullRequest, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/git-pull-request.tsx)
- [Lucide Animated Github, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/github.tsx)
- [Lucide Animated Gitlab, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/gitlab.tsx)

- [Lucide Animated Grip, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/grip.tsx)

- [Lucide Animated GripHorizontal, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/grip-horizontal.tsx)

- [Lucide Animated GripVertical, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/grip-vertical.tsx)

- [Lucide Animated Home, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/home.tsx)

- [Lucide Animated AudioLines, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/audio-lines.tsx)
- [Lucide license](https://github.com/lucide-icons/lucide/blob/main/LICENSE)
- [Lucide Animated ArrowUpLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up-left.tsx)

- [Lucide Animated Bot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bot.tsx)
- [Lucide Animated MapPin](https://github.com/pqoqubbw/icons/blob/main/icons/map-pin.tsx)
- [Lucide Animated ArrowRight](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-right.tsx)
- [Lucide Animated ArrowUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up.tsx)
- [Lucide Animated ArrowUpRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-up-right.tsx)
- [Lucide Animated ArrowLeft](https://github.com/pqoqubbw/icons/blob/main/icons/arrow-left.tsx)
- [Lucide Animated Copy](https://github.com/pqoqubbw/icons/blob/main/icons/copy.tsx)
- [Lucide Animated Archive](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/archive.tsx)
- [Lucide Animated Check](https://github.com/pqoqubbw/icons/blob/main/icons/check.tsx)
- [Lucide Animated ArrowDown](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-down.tsx)
- [Lucide Animated AtSign](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/at-sign.tsx)
- [Lucide Animated FileText, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/file-text.tsx)

- [Lucide Animated AttachFile, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/attach-file.tsx)
- [Lucide Animated ChevronDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-down.tsx)
- [Lucide Animated ChevronFirst, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-first.tsx)
- [Lucide Animated ChevronLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-left.tsx)
- [Lucide Animated ChevronRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-right.tsx)
- [Lucide Animated ChevronUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevron-up.tsx)
- [Lucide Animated ChevronsDownUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevrons-down-up.tsx)
- [Lucide Animated ChevronsLeftRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevrons-left-right.tsx)
- [Lucide Animated ChevronsRightLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevrons-right-left.tsx)
- [Lucide Animated ChevronsUpDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chevrons-up-down.tsx)
- [Lucide Animated CircleChevronDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-chevron-down.tsx)
- [Lucide Animated CircleChevronLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-chevron-left.tsx)
- [Lucide Animated CircleChevronRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-chevron-right.tsx)
- [Lucide Animated CircleChevronUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/circle-chevron-up.tsx)
- [Lucide Animated SquareChevronDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/square-chevron-down.tsx)
- [Lucide Animated SquareChevronLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/square-chevron-left.tsx)
- [Lucide Animated SquareChevronRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/square-chevron-right.tsx)
- [Lucide Animated SquareChevronUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/square-chevron-up.tsx)
- [Lucide Animated FolderArchive, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-archive.tsx)
- [Lucide Animated FolderCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-check.tsx)
- [Lucide Animated FolderClock, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-clock.tsx)
- [Lucide Animated FolderCode, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-code.tsx)
- [Lucide Animated FolderCog, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-cog.tsx)
- [Lucide Animated FolderDot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-dot.tsx)
- [Lucide Animated FolderDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-down.tsx)
- [Lucide Animated FolderHeart, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-heart.tsx)
- [Lucide Animated FolderInput, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-input.tsx)
- [Lucide Animated FolderKanban, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-kanban.tsx)
- [Lucide Animated FolderKey, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-key.tsx)
- [Lucide Animated FolderLock, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-lock.tsx)
- [Lucide Animated FolderMinus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-minus.tsx)
- [Lucide Animated FolderOpen, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-open.tsx)
- [Lucide Animated FolderOutput, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-output.tsx)
- [Lucide Animated FolderPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-plus.tsx)
- [Lucide Animated FolderRoot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-root.tsx)
- [Lucide Animated FolderSync, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-sync.tsx)
- [Lucide Animated FolderTree, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-tree.tsx)
- [Lucide Animated FolderUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-up.tsx)
- [Lucide Animated FolderX, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folder-x.tsx)
- [Lucide Animated Folders, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/folders.tsx)
- [Lucide Animated license](https://github.com/pqoqubbw/icons/blob/main/LICENSE)

- [Lucide Animated Sun, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/sun.tsx)
- [Lucide Animated Moon, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/moon.tsx)
- [Lucide Animated Linkedin, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/linkedin.tsx)
- [Lucide Monitor, pinned drawing](https://github.com/lucide-icons/lucide/blob/66de90d63e5e26d867a4391bd607fd7a3bbe17fd/icons/monitor.svg)

- [Lucide Animated User, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user.tsx)
- [Lucide Animated UserCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-check.tsx)
- [Lucide Animated UserPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-plus.tsx)
- [Lucide Animated UserRoundCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-round-check.tsx)
- [Lucide Animated UserRoundCog, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-round-cog.tsx)
- [Lucide Animated UserRoundPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/user-round-plus.tsx)
- [Lucide Animated Users, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/users.tsx)

- [Lucide Animated Login, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/login.tsx)
- [Lucide Animated Logout, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/logout.tsx)
- [Lucide Animated RefreshCw, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/refresh-cw.tsx)
- [Lucide Animated RefreshCcw, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/refresh-ccw.tsx)
- [Lucide Animated RotateCw, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/rotate-cw.tsx)
- [Lucide Animated RotateCcw, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/rotate-ccw.tsx)
- [Lucide Animated Undo, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/undo.tsx)
- [Lucide Animated Redo, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/redo.tsx)
- [Lucide Animated UndoDot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/undo-dot.tsx)
- [Lucide Animated RedoDot, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/redo-dot.tsx)
- [Lucide Animated Download, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/download.tsx)
- [Lucide Animated Upload, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/upload.tsx)
- [Lucide Animated ClipboardCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/clipboard-check.tsx)
- [Lucide Animated Delete, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/delete.tsx)
- [Lucide Animated FileCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/file-check.tsx)
- [Lucide Animated FileCheck2, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/file-check-2.tsx)
- [Lucide Animated FilePenLine, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/file-pen-line.tsx)
- [Lucide Animated FileCog, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/file-cog.tsx)
- [Lucide Animated FileStack, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/file-stack.tsx)
- [Lucide Animated FileChartLine, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/file-chart-line.tsx)
- [Lucide Animated MessageCircle, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-circle.tsx)
- [Lucide Animated MessageCircleCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-circle-check.tsx)
- [Lucide Animated MessageCircleMore, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-circle-more.tsx)
- [Lucide Animated MessageCirclePlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-circle-plus.tsx)
- [Lucide Animated MessageCircleX, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-circle-x.tsx)
- [Lucide Animated MessageSquare, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-square.tsx)
- [Lucide Animated MessageSquareCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-square-check.tsx)
- [Lucide Animated MessageSquareMore, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-square-more.tsx)
- [Lucide Animated MessageSquarePlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-square-plus.tsx)
- [Lucide Animated MessageSquareX, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/message-square-x.tsx)
- [Lucide Animated Search, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/search.tsx)
- [Lucide Animated Menu, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/menu.tsx)
- [Lucide Animated X, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/x.tsx)
- [Lucide Animated Plus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/plus.tsx)
- [Lucide Animated Settings, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/settings.tsx)
- [Lucide Animated SlidersHorizontal, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/sliders-horizontal.tsx)
- [Lucide Animated Eye, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/eye.tsx)
- [Lucide Animated EyeOff, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/eye-off.tsx)
- [Lucide Animated ExternalLink, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/external-link.tsx)
- [Lucide Animated Link, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/link.tsx)

- [Lucide Animated Battery, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/battery.tsx)
- [Lucide Animated BatteryCharging, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/battery-charging.tsx)
- [Lucide Animated BatteryFull, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/battery-full.tsx)
- [Lucide Animated BatteryLow, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/battery-low.tsx)
- [Lucide Animated BatteryMedium, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/battery-medium.tsx)
- [Lucide Animated BatteryPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/battery-plus.tsx)
- [Lucide Animated BatteryWarning, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/battery-warning.tsx)
- [Lucide Animated Bluetooth, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bluetooth.tsx)
- [Lucide Animated BluetoothConnected, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bluetooth-connected.tsx)
- [Lucide Animated BluetoothOff, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bluetooth-off.tsx)
- [Lucide Animated AlarmClock, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/alarm-clock.tsx)
- [Lucide Animated AlarmClockCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/alarm-clock-check.tsx)
- [Lucide Animated AlarmClockMinus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/alarm-clock-minus.tsx)
- [Lucide Animated AlarmClockPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/alarm-clock-plus.tsx)
- [Lucide Animated Clock, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/clock.tsx)
- [Lucide Animated Timer, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/timer.tsx)
- [Lucide Animated Hourglass, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/hourglass.tsx)
- [Lucide Animated History, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/history.tsx)
- [Lucide Animated CalendarCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/calendar-check.tsx)
- [Lucide Animated CalendarCheck2, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/calendar-check-2.tsx)

- [Lucide Animated ChartBarDecreasing, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-bar-decreasing.tsx)
- [Lucide Animated ChartBarIncreasing, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-bar-increasing.tsx)
- [Lucide Animated ChartColumnDecreasing, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-column-decreasing.tsx)
- [Lucide Animated ChartColumnIncreasing, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-column-increasing.tsx)
- [Lucide Animated ChartLine, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-line.tsx)
- [Lucide Animated ChartNoAxesColumnDecreasing, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-no-axes-column-decreasing.tsx)
- [Lucide Animated ChartNoAxesColumnIncreasing, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-no-axes-column-increasing.tsx)
- [Lucide Animated ChartPie, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-pie.tsx)
- [Lucide Animated ChartScatter, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-scatter.tsx)
- [Lucide Animated ChartSpline, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/chart-spline.tsx)

The energy and Bluetooth adapters and their copied comparison sources use the pinned Lucide Animated revision above. The comparison sources change only the class utility import. Battery preserves the upstream empty interior at rest. Battery level adapters combine the two asynchronous phases into one cancellable timeline so stopped playback cannot start a later phase.

- [Lucide Animated Wifi, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/wifi.tsx)
- [Lucide Animated WifiLow, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/wifi-low.tsx)
- [Lucide Animated WifiCog, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/wifi-cog.tsx)
- [Lucide Animated WifiPen, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/wifi-pen.tsx)
- [Lucide Animated WifiSync, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/wifi-sync.tsx)
- [Lucide Animated BluetoothSearching, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/bluetooth-searching.tsx)
- [Lucide Animated Nfc, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/nfc.tsx)
- [Lucide Animated Router, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/router.tsx)
- [Lucide Animated Radio, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/radio.tsx)
- [Lucide Animated RadioTower, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/radio-tower.tsx)

The connectivity adapters use these pinned sources. Their comparison copies change only the class utility import. WifiCog and WifiSync ignore the upstream fixed 24 px dimensions in the adapter to honor the common size prop; the comparison retains the originals and checks these two at 24 px. Signal adapters combine asynchronous fade-out and spring fade-in into cancellable tracks, including native spring normalization to 100 and the fade completion velocity from Motion's 30 ms velocity window. BluetoothSearching samples either side of exact JavaScript repeat boundaries because native tracks already start the next iteration at that instant. WifiLow also combines its delayed question-mark show and timed hide, preventing callbacks after cancellation. Native stroke lengths and sampled SVG transforms preserve the drawing and local transform origins.


- [Lucide Animated MapPinCheckInside, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/map-pin-check-inside.tsx)
- [Lucide Animated MapPinCheck, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/map-pin-check.tsx)
- [Lucide Animated MapPinHouse, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/map-pin-house.tsx)
- [Lucide Animated MapPinMinusInside, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/map-pin-minus-inside.tsx)
- [Lucide Animated MapPinMinus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/map-pin-minus.tsx)
- [Lucide Animated MapPinOff, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/map-pin-off.tsx)
- [Lucide Animated MapPinPlusInside, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/map-pin-plus-inside.tsx)
- [Lucide Animated MapPinPlus, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/map-pin-plus.tsx)
- [Lucide Animated MapPinXInside, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/map-pin-x-inside.tsx)
- [Lucide Animated Compass, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/compass.tsx)
- [Lucide Animated Receipt, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt.tsx)
- [Lucide Animated ReceiptCent, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt-cent.tsx)
- [Lucide Animated ReceiptEuro, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt-euro.tsx)
- [Lucide Animated ReceiptIndianRupee, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt-indian-rupee.tsx)
- [Lucide Animated ReceiptJapaneseYen, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt-japanese-yen.tsx)
- [Lucide Animated ReceiptPoundSterling, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt-pound-sterling.tsx)
- [Lucide Animated ReceiptRussianRuble, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt-russian-ruble.tsx)
- [Lucide Animated ReceiptSwissFranc, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt-swiss-franc.tsx)
- [Lucide Animated ReceiptText, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt-text.tsx)
- [Lucide Animated ReceiptTurkishLira, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/receipt-turkish-lira.tsx)

The receipt adapters use the pinned sources above. Copied comparison sources change only the class utility import. ReceiptSwissFranc respects the requested size instead of the upstream fixed 24 px; the comparison runner normalizes that SVG after mounting. Currency paths preserve their individual entry and return durations, opacity timings, secondary delays, and path offsets. ReceiptText combines the asynchronous reverse-staggered erase and forward-staggered redraw into one cancellable timeline, so interruption cannot restart a queued phase.

- [Lucide Animated ArrowDownLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-down-left.tsx)
- [Lucide Animated ArrowDownRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-down-right.tsx)
- [Lucide Animated ArrowBigDown, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-big-down.tsx)
- [Lucide Animated ArrowBigDownDash, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-big-down-dash.tsx)
- [Lucide Animated ArrowBigLeft, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-big-left.tsx)
- [Lucide Animated ArrowBigLeftDash, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-big-left-dash.tsx)
- [Lucide Animated ArrowBigRight, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-big-right.tsx)
- [Lucide Animated ArrowBigRightDash, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-big-right-dash.tsx)
- [Lucide Animated ArrowBigUp, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-big-up.tsx)
- [Lucide Animated ArrowBigUpDash, pinned source](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/icons/arrow-big-up-dash.tsx)

The directional arrow adapters use these pinned sources. Their copied comparison sources change only the class utility import. Diagonals retain distinct head and shaft paths and their individual SVG origins. Big arrows preserve their 3-unit pulse and separate 1-unit dash pulse. Sampled native transforms preserve the 0.5-second diagonal and 0.4-second big-arrow entry curves, plus the implicit translation and scale return springs. The comparison captures entry poses and resets velocity on both versions before measuring returns; manual playback retains interrupted velocity.

## Lucide and Feather

ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, user-check, user-plus, users, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Lucide Animated

MIT License

Copyright (c) 2024-2026 pqoqubbw

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
