const golfRoutine=[
[26,106,'Neck & shoulder rotations','Alternate sides','Neck & shoulders','Reach both arms out. Turn one palm up and the other down; look toward the upturned palm. Reverse with each breath.','neck'],
[106,181,'Diagonal chest opener','Left arm','Shoulders','From all fours, reach your left arm diagonally forward. Lower that shoulder and turn your chest away. Gently press the hand down for 5 seconds, then relax deeper.','chest'],
[181,237,'Diagonal chest opener','Right arm','Shoulders','Reach your right arm diagonally forward, supported by the other arm. Lower the shoulder, gently press down for 5 seconds, then exhale and open the chest.','chest'],
[237,313,'Active thoracic rotation','Left arm · 5 reps','Shoulders','On all fours, place your left hand behind your head. Lift the elbow and look up; hold 4–5 seconds. Lower toward the supporting arm and repeat five times.','rotate'],
[313,376,'Active thoracic rotation','Right arm · 5 reps','Shoulders','Keep the left arm straight and put your right hand behind your head. Rotate the elbow upward, hold 4–5 seconds, then lower. Complete five controlled reps.','rotate'],
[376,441,'Thread the needle','Right arm through','Shoulders','Slide your right arm beneath your left. Rest the right shoulder down; use the left hand to gently turn your chest upward. Breathe into the stretch.','thread'],
[441,500,'Thread the needle','Left arm through','Shoulders','Slide your left arm beneath your right and rest onto the left shoulder. Use your right hand for support as you gently turn the chest upward.','thread'],
[500,608,'Side plank reach','Right side · 5 reps','Spine','Support on the right arm and bent right knee, left leg straight. Lift the hips and reach your left arm overhead. Hold 5 seconds, lower, and repeat five times.','plank'],
[608,666,'Side plank reach','Left side · 5 reps','Spine','Support on the left arm and bent left knee, right leg straight. Lift the hips and reach your right arm overhead. Hold 5 seconds at the top of each of five reps.','plank'],
[666,737,'Seated hip swivels','Alternate sides · 10 reps','Hips','Sit with feet wider than the shoulders, hands behind you. Drop both knees to one side, pause, and switch. Keep the chest facing forward for ten total reps.','swivel'],
[737,835,'90/90 glute stretch','Right leg forward','Hips','Bend both knees to 90°. Hinge over your front right leg with a long back, then reach the left arm across to lower the left shoulder. Use a cushion under the hips if needed.','glute'],
[835,899,'90/90 internal rotation','Left rear hip','Hips','Keep the same leg position. Turn your chest toward the rear left knee and gently settle that hip down. Bend the rear leg more if the position feels uncomfortable.','internal'],
[899,981,'90/90 glute stretch','Left leg forward','Hips','Swivel to bring your left leg forward, both knees bent to 90°. Hinge over the front leg and reach your right arm across, easing the right shoulder toward the floor.','glute'],
[981,1028,'90/90 internal rotation','Right rear hip','Hips','Stay in 90/90 and turn your chest toward the rear right knee. Breathe into your belly and gently settle the right hip toward the ground.','internal'],
[1028,1141,'Alternating hamstring stretch','Alternate sides','Hips & hamstrings','Fold forward with bent knees, belly near the thighs. Support your hands on blocks or a chair. Straighten one leg while drawing the opposite knee forward; alternate slowly.','hamstring'],
[1141,1210,'Low lunge hip opener','Right foot forward','Hips','Bring your right foot beside your hands, back knee down. Let the right knee open outward and the left hip sink gently. Breathe into the hip; hold for 45 seconds.','lunge'],
[1210,1270,'Low lunge hip opener','Left foot forward','Hips','Bring your left foot beside your hands, back knee down. Allow the left knee to open outward and the right hip to settle toward the floor. Hold for 45 seconds.','lunge']
].map(([start,end,title,side,group,description,pose])=>({start,title,side,group,description,pose}));
// Exercise prescriptions, excluding the video's explanations and setup time.
// Rotation/plank cadence: 5-second effort + 5 seconds to lower and return.
// Chest cadence: 15 seconds to settle, 5-second gentle press, 10-second release.
const golfTiming = {
 neck: { duration:60, prescription:'60 seconds · alternate with each breath' },
 chest: { duration:30, prescription:'15s settle · 5s gentle press · 10s release' },
 rotate: { duration:50, reps:5, cycle:10, hold:5, prescription:'5 reps · 5s hold + 5s lower and return' },
 thread: { duration:30, prescription:'30-second relaxed hold' },
 plank: { duration:50, reps:5, cycle:10, hold:5, prescription:'5 reps · 5s hold + 5s lower and return' },
 swivel: { duration:60, reps:10, cycle:6, prescription:'10 alternating reps · 6 seconds per side' },
 glute: { duration:60, prescription:'60-second hold' },
 internal: { duration:30, prescription:'30-second hold' },
 hamstring: { duration:60, prescription:'60 seconds · alternate slowly' },
 lunge: { duration:45, prescription:'45-second hold' }
};
golfRoutine.forEach(s => Object.assign(s, golfTiming[s.pose]));
const golfTotalSeconds = golfRoutine.reduce((total,s) => total+s.duration,0);
function golfRepCue(s, remaining) {
 const elapsed = Math.min(s.duration, Math.max(0,s.duration-remaining));
 if(s.reps) {
  const rep = Math.min(s.reps,Math.floor(elapsed/s.cycle)+1);
  if(s.pose==='swivel') return `Rep ${rep} of ${s.reps} · ${rep%2 ? 'First side' : 'Other side'}`;
  const part=elapsed%s.cycle;
  return `Rep ${rep} of ${s.reps} · ${part<s.hold ? 'Hold' : 'Lower & return'}`;
 }
 if(s.pose==='chest') return elapsed<15 ? 'Settle into the stretch' : elapsed<20 ? 'Gently press hand down' : 'Release & breathe';
 return s.pose === 'neck' ? 'Switch with each breath' : s.pose === 'hamstring' ? 'Alternate sides slowly' : 'Breathe slowly · ease into the stretch';
}
// Detailed shaded illustrations share one image sheet; each viewport shows a single pose.
const golfArtwork = {
 neck: [0,18,365,390], chest: [367,180,360,225],
 rotate: [727,40,286,355], thread: [1038,182,333,221],
 plank: [1380,48,394,330], swivel: [8,482,315,348],
 glute: [352,550,370,282], internal: [733,483,280,335],
 hamstring: [1092,474,285,340], lunge: [1395,485,375,342]
};
function golfIllustration(s) {
 const [x,y,w,h]=golfArtwork[s.pose];
 const mirror=/Right arm|Left arm through|Left side|Left leg forward|Right rear hip|Left foot/.test(s.side);
 const transform=mirror ? `translate(${2*x+w} 0) scale(-1 1)` : '';
 return `<svg class="golf-artwork" viewBox="${x} ${y} ${w} ${h}" role="img" aria-label="Detailed illustration of ${s.title}. ${s.side}." xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="golfPoseClip"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#golfPoseClip)"><g transform="${transform}"><image href="assets/golf-mobility.jpg" width="1774" height="887"/></g></g></svg>`;
}
