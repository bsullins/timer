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
[1141,1210,'Low lunge hip opener','Right foot forward','Hips','Bring your right foot beside your hands, back knee down. Let the right knee open outward and the left hip sink gently. Breathe into the hip; hold about 45 seconds after setup.','lunge'],
[1210,1270,'Low lunge hip opener','Left foot forward','Hips','Bring your left foot beside your hands, back knee down. Allow the left knee to open outward and the right hip to settle toward the floor. Hold about 45 seconds after setup.','lunge']
].map(([start,end,title,side,group,description,pose])=>({start,duration:end-start,title,side,group,description,pose}));
// Original vector figures. Coordinates describe joints; tapered contours give limbs
// visible volume while preserving clear hand, knee, and foot contact with the floor.
const golfFigures = {
 neck: {head:[150,36],body:[[138,58],[162,58],[168,106],[132,106]],arms:[[[140,64],[108,73],[67,70]],[[160,64],[195,72],[234,69]]],legs:[[[141,105],[128,139],[112,169]],[[159,105],[174,140],[190,169]]],highlight:[140,65,17,9],arrow:'M178 32 Q200 46 176 55',cue:'Turn palms · follow with your gaze'},
 chest: {head:[92,121],body:[[111,104],[128,91],[182,81],[191,99]],arms:[[[119,105],[89,134],[47,153]],[[128,105],[143,134],[143,164]]],legs:[[[183,91],[206,156],[249,164]],[[177,98],[179,157],[215,165]]],highlight:[122,105,20,10],arrow:'M90 79 Q67 104 79 126',cue:'Lower shoulder · turn chest away'},
 rotate: {head:[121,75],body:[[135,89],[149,81],[190,109],[178,123]],arms:[[[139,95],[132,130],[130,166]],[[148,89],[169,53],[126,62]]],legs:[[[183,114],[191,160],[233,166]],[[175,116],[164,159],[202,166]]],highlight:[157,100,18,12],arrow:'M185 87 Q210 49 177 33',cue:'Lift elbow · hold 4–5 seconds'},
 thread: {head:[91,142],body:[[109,127],[123,109],[179,88],[190,107]],arms:[[[116,128],[151,150],[204,159]],[[124,116],[105,92],[91,162]]],legs:[[[184,100],[205,158],[249,166]],[[176,105],[170,160],[210,166]]],highlight:[124,121,19,11],arrow:'M154 87 Q143 60 121 77',cue:'Reach underneath · rotate chest'},
 plank: {head:[94,94],body:[[110,103],[119,90],[177,116],[168,132]],arms:[[[116,105],[103,135],[94,167]],[[120,95],[96,57],[49,64]]],legs:[[[174,123],[217,146],[253,165]],[[170,128],[169,163],[135,167]]],highlight:[145,110,25,9],arrow:'M161 95 Q170 73 189 74',cue:'Lift hips · lengthen the top side'},
 swivel: {head:[150,47],body:[[138,68],[163,68],[171,118],[137,118]],arms:[[[140,76],[115,109],[101,159]],[[162,76],[194,111],[208,159]]],legs:[[[143,117],[112,145],[80,158]],[[163,117],[192,143],[220,158]]],highlight:[154,120,25,13],arrow:'M114 164 Q150 187 194 164',cue:'Keep chest forward · knees travel together'},
 glute: {head:[103,96],body:[[121,98],[134,85],[182,124],[171,139]],arms:[[[128,105],[101,132],[64,156]],[[139,109],[130,140],[103,159]]],legs:[[[174,133],[135,152],[93,156]],[[178,129],[218,153],[239,128]]],highlight:[171,135,18,12],arrow:'M142 69 Q118 65 107 79',cue:'Hinge forward · reach across'},
 internal: {head:[176,53],body:[[161,74],[184,78],[174,128],[152,123]],arms:[[[165,82],[148,114],[188,157]],[[182,85],[205,116],[227,157]]],legs:[[[157,122],[120,149],[80,156]],[[173,124],[214,152],[237,127]]],highlight:[180,132,20,13],arrow:'M140 74 Q114 96 140 117',cue:'Turn toward rear knee · settle hip'},
 hamstring: {head:[112,121],body:[[124,107],[139,114],[182,68],[169,56]],arms:[[[132,113],[122,137],[119,154]],[[143,107],[145,130],[147,154]]],legs:[[[177,69],[194,113],[208,168]],[[169,72],[148,117],[160,167]]],highlight:[185,107,8,27],arrow:'M214 91 Q231 115 220 144',cue:'Lengthen one leg · draw the other knee forward'},
 lunge: {head:[126,74],body:[[141,86],[154,76],[190,119],[177,133]],arms:[[[148,91],[132,126],[127,166]],[[158,95],[157,133],[158,166]]],legs:[[[179,124],[125,122],[108,166]],[[185,125],[226,162],[267,166]]],highlight:[184,126,18,11],arrow:'M204 102 Q214 117 203 141',cue:'Back knee down · let the hip settle'}
};
function golfContour(points) {
 const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
 return 'M'+mid(points.at(-1),points[0]).join(',')+points.map((p,i)=>' Q'+p.join(',')+' '+mid(p,points[(i+1)%points.length]).join(',')).join('')+' Z';
}
function golfLimb(points, widths=[7,5.5,3.5]) {
 const left=[],right=[];
 points.forEach(([x,y],i)=>{const p=points[Math.max(0,i-1)],n=points[Math.min(points.length-1,i+1)],dx=n[0]-p[0],dy=n[1]-p[1],len=Math.hypot(dx,dy)||1,w=widths[i];left.push([x-dy/len*w,y+dx/len*w]);right.unshift([x+dy/len*w,y-dx/len*w]);});
 return `<path d="${golfContour([...left,...right])}"/>`;
}
function golfFigureMarkup(pose, variant=false) {
 const p=JSON.parse(JSON.stringify(golfFigures[pose]));
 if(variant) {
  if(pose==='neck'){p.head[0]-=7;p.arms[0][2][1]-=15;p.arms[1][2][1]+=15;}
  if(pose==='rotate'){p.arms[1]=[[148,89],[121,120],[126,83]];}
  if(pose==='swivel'){p.legs=[[[143,117],[120,148],[157,164]],[[163,117],[196,145],[166,163]]];}
  if(pose==='hamstring'){p.legs=[[[177,69],[179,118],[184,168]],[[169,72],[145,111],[144,166]]];p.highlight=[155,108,8,27];}
  if(pose==='plank'){p.body=p.body.map(([x,y])=>[x,y+16]);p.arms[1]=[[120,111],[132,139],[165,151]];p.highlight=[145,126,25,9];}
 }
 return `<path d="M35 176 H277" fill="none" stroke="#606860" stroke-width="1"/>
 ${pose==='hamstring'?'<path d="M105 174 V156 H155 V174" fill="#252c25" stroke="#879285" stroke-width="1.5"/>':''}
 <g fill="#151a16" stroke="#f0f3ed" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
 ${p.legs.map(l=>golfLimb(l,[10,7,4])).join('')}
 <path d="${golfContour(p.body)}"/>
 ${p.arms.map(l=>golfLimb(l)).join('')}
 <ellipse cx="${p.head[0]}" cy="${p.head[1]}" rx="10" ry="13"/>
 <path d="M${p.head[0]-3} ${p.head[1]+13} l1 6 m5 -6 l1 6"/>
 </g>
 <ellipse cx="${p.highlight[0]}" cy="${p.highlight[1]}" rx="${p.highlight[2]}" ry="${p.highlight[3]}" fill="#b8d996" opacity=".26" transform="rotate(-15 ${p.highlight[0]} ${p.highlight[1]})"/>
 ${!variant?`<path d="${p.arrow}" fill="none" stroke="#bddb9e" stroke-width="2" marker-end="url(#golfArrow)"/>`:''}`;
}
function golfIllustration(s) {
 const paired=['neck','rotate','plank','swivel','hamstring'].includes(s.pose);
 const mirror=/Right arm|Left arm through|Left side|Left leg forward|Right rear hip|Left foot/.test(s.side);
 const panel=(x,variant,label)=>`<g transform="translate(${x} 0)"><g ${mirror?'transform="translate(310 0) scale(-1 1)"':''}>${golfFigureMarkup(s.pose,variant)}</g><text x="155" y="202" text-anchor="middle" fill="#b8c3b3" font-size="11" font-family="inherit" letter-spacing="1.2">${label}</text></g>`;
 return `<svg viewBox="0 0 ${paired?640:320} 228" role="img" aria-label="${s.title}. ${s.side}. ${golfFigures[s.pose].cue}. ${paired?'Two positions show the movement.':''}"><defs><marker id="golfArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M1 1 L5 3 L1 5" fill="none" stroke="#bddb9e" stroke-width="1.3"/></marker></defs>${paired?panel(0,true,s.pose==='swivel'||s.pose==='neck'?'ONE SIDE':'START')+panel(330,false,s.pose==='swivel'||s.pose==='neck'?'OTHER SIDE':'MOVE & HOLD'):panel(5,false,'POSITION')}<text x="${paired?320:160}" y="224" text-anchor="middle" fill="#c0d9a8" font-size="10" font-family="inherit">${golfFigures[s.pose].cue}</text></svg>`;
}
