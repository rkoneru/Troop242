import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/ScoutToolsPortal.css';

// ═══════════════════════════════════════
// MODULE DATA - Static, no reactivity needed
// ═══════════════════════════════════════

const STAR_QUIZ_DATA = [
  {
    name: 'Ursa Major (Big Dipper)',
    hint: '7 stars forming a dipper or ladle shape',
    fact: 'The two outer stars of the Big Dipper\'s bowl point directly to Polaris — the North Star. Navigators call them the "Pointer Stars."',
    opts: ['Ursa Major (Big Dipper)', 'Cassiopeia', 'Orion', 'Leo'],
    svg: `<svg width="180" height="140" viewBox="0 0 180 140"><line x1="30" y1="90" x2="60" y2="80" stroke="#4ADE80" stroke-width="1.5"/><line x1="60" y1="80" x2="95" y2="75" stroke="#4ADE80" stroke-width="1.5"/><line x1="95" y1="75" x2="120" y2="85" stroke="#4ADE80" stroke-width="1.5"/><line x1="120" y1="85" x2="150" y2="95" stroke="#4ADE80" stroke-width="1.5"/><line x1="150" y1="95" x2="145" y2="55" stroke="#4ADE80" stroke-width="1.5"/><line x1="145" y1="55" x2="120" y2="85" stroke="#4ADE80" stroke-width="1.5"/>${[[30,90],[60,80],[95,75],[120,85],[150,95],[145,55],[120,85]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="5" fill="#FACC15" stroke="#FDE047" stroke-width="1"/>').join('')}</svg>`
  },
  {
    name: 'Orion',
    hint: '3 stars in a perfect row form the belt',
    fact: 'Orion\'s Belt — Alnitak, Alnilam, and Mintaka — always rises due east and sets due west, making it a reliable direction indicator worldwide.',
    opts: ['Scorpius', 'Orion', 'Perseus', 'Lyra'],
    svg: `<svg width="180" height="160" viewBox="0 0 180 160"><line x1="50" y1="40" x2="90" y2="30" stroke="#4ADE80" stroke-width="1.5"/><line x1="90" y1="30" x2="130" y2="40" stroke="#4ADE80" stroke-width="1.5"/><line x1="50" y1="40" x2="60" y2="80" stroke="#4ADE80" stroke-width="1.5"/><line x1="130" y1="40" x2="120" y2="80" stroke="#4ADE80" stroke-width="1.5"/><line x1="60" y1="80" x2="75" y2="90" stroke="#4ADE80" stroke-width="1.5"/><line x1="75" y1="90" x2="105" y2="90" stroke="#4ADE80" stroke-width="1.5"/><line x1="105" y1="90" x2="120" y2="80" stroke="#4ADE80" stroke-width="1.5"/><line x1="75" y1="90" x2="70" y2="130" stroke="#4ADE80" stroke-width="1.5"/><line x1="105" y1="90" x2="110" y2="130" stroke="#4ADE80" stroke-width="1.5"/>${[[50,40],[90,30],[130,40],[60,80],[120,80],[75,90],[105,90],[70,130],[110,130]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="'+(x===90?'6':'4')+'" fill="'+(x===75||x===105?'#93C5FD':'#FACC15')+'" stroke="#FDE047" stroke-width="1"/>').join('')}</svg>`
  },
  {
    name: 'Cassiopeia',
    hint: '5 stars shaped like a W or M',
    fact: 'Cassiopeia is almost always visible from the Northern Hemisphere and stays opposite the Big Dipper across Polaris — so if one is low, use the other to find North.',
    opts: ['Cassiopeia', 'Lyra', 'Cygnus', 'Corona Borealis'],
    svg: `<svg width="180" height="100" viewBox="0 0 180 100"><line x1="20" y1="80" x2="55" y2="20" stroke="#4ADE80" stroke-width="1.5"/><line x1="55" y1="20" x2="90" y2="60" stroke="#4ADE80" stroke-width="1.5"/><line x1="90" y1="60" x2="125" y2="20" stroke="#4ADE80" stroke-width="1.5"/><line x1="125" y1="20" x2="160" y2="70" stroke="#4ADE80" stroke-width="1.5"/>${[[20,80],[55,20],[90,60],[125,20],[160,70]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="5" fill="#FACC15" stroke="#FDE047" stroke-width="1"/>').join('')}</svg>`
  },
  {
    name: 'Polaris (North Star)',
    hint: 'The fixed point all other stars revolve around',
    fact: 'Polaris is within 0.7° of true geographic north. To find it: locate the Big Dipper\'s pointer stars (Dubhe and Merak) and follow them 5x their distance straight ahead.',
    opts: ['Polaris (North Star)', 'Sirius', 'Vega', 'Arcturus'],
    svg: `<svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="8" fill="#FACC15" stroke="#FDE047" stroke-width="1.5"/>${[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180,x=60+50*Math.cos(r),y=60+50*Math.sin(r);return'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.5" fill="#86EFAC" opacity=".5"/>'}).join('')}${[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180,x=60+28*Math.cos(r),y=60+28*Math.sin(r);return'<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2" fill="#93C5FD" opacity=".4"/>'}).join('')}<text x="60" y="108" text-anchor="middle" fill="rgba(255,255,255,.3)" font-size="10" font-family="Inter">N</text></svg>`
  },
  {
    name: 'Southern Cross (Crux)',
    hint: '4 main stars forming a cross visible in the Southern Hemisphere',
    fact: 'Crux points toward the South Celestial Pole. In the Southern Hemisphere, sailors use it the same way Northerners use Polaris.',
    opts: ['Southern Cross', 'Centaurus', 'Grus', 'Pavo'],
    svg: `<svg width="140" height="160" viewBox="0 0 140 160"><line x1="70" y1="20" x2="70" y2="140" stroke="#4ADE80" stroke-width="1.5"/><line x1="30" y1="60" x2="110" y2="100" stroke="#4ADE80" stroke-width="1.5"/>${[[70,20],[70,140],[30,60],[110,100]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="5" fill="#FACC15" stroke="#FDE047" stroke-width="1"/>').join('')}</svg>`
  },
  {
    name: 'Scorpius',
    hint: 'Red star Antares marks the scorpion\'s heart',
    fact: 'Scorpius contains Antares, a red supergiant star. Antares is Latin for "rival of Mars" because of its red color.',
    opts: ['Scorpius', 'Sagittarius', 'Libra', 'Lupus'],
    svg: `<svg width="160" height="180" viewBox="0 0 160 180"><line x1="80" y1="20" x2="70" y2="50" stroke="#4ADE80" stroke-width="1.5"/><line x1="70" y1="50" x2="80" y2="80" stroke="#4ADE80" stroke-width="1.5"/><line x1="80" y1="80" x2="120" y2="100" stroke="#4ADE80" stroke-width="1.5"/><line x1="120" y1="100" x2="140" y2="140" stroke="#4ADE80" stroke-width="1.5"/><line x1="140" y1="140" x2="100" y2="160" stroke="#4ADE80" stroke-width="1.5"/><line x1="80" y1="80" x2="40" y2="100" stroke="#4ADE80" stroke-width="1.5"/>${[[80,20],[70,50],[80,80],[120,100],[140,140],[100,160],[40,100]].map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="'+(i===2?'6':'4')+'" fill="'+(i===2?'#FF6B6B':'#FACC15')+'" stroke="#FDE047" stroke-width="1"/>').join('')}</svg>`
  },
  {
    name: 'Leo',
    hint: 'Bright star Regulus marks the lion\'s front paw',
    fact: 'Leo is one of the zodiacal constellations and is visible from both Northern and Southern hemispheres during spring.',
    opts: ['Leo', 'Virgo', 'Cancer', 'Hydra'],
    svg: `<svg width="180" height="140" viewBox="0 0 180 140"><line x1="30" y1="70" x2="60" y2="50" stroke="#4ADE80" stroke-width="1.5"/><line x1="60" y1="50" x2="90" y2="40" stroke="#4ADE80" stroke-width="1.5"/><line x1="90" y1="40" x2="120" y2="50" stroke="#4ADE80" stroke-width="1.5"/><line x1="120" y1="50" x2="150" y2="70" stroke="#4ADE80" stroke-width="1.5"/><line x1="90" y1="40" x2="80" y2="90" stroke="#4ADE80" stroke-width="1.5"/><line x1="80" y1="90" x2="110" y2="120" stroke="#4ADE80" stroke-width="1.5"/>${[[30,70],[60,50],[90,40],[120,50],[150,70],[80,90],[110,120]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="4" fill="#FACC15" stroke="#FDE047" stroke-width="1"/>').join('')}</svg>`
  },
  {
    name: 'Cygnus (The Swan)',
    hint: 'Forms a cross shape in the sky',
    fact: 'Cygnus flies along the Milky Way. Its brightest star, Deneb, is one of the vertices of the Summer Triangle.',
    opts: ['Cygnus', 'Aquila', 'Draco', 'Pegasus'],
    svg: `<svg width="160" height="160" viewBox="0 0 160 160"><line x1="80" y1="20" x2="80" y2="140" stroke="#4ADE80" stroke-width="1.5"/><line x1="40" y1="60" x2="120" y2="100" stroke="#4ADE80" stroke-width="1.5"/><line x1="80" y1="100" x2="60" y2="140" stroke="#4ADE80" stroke-width="1.5"/><line x1="80" y1="100" x2="100" y2="140" stroke="#4ADE80" stroke-width="1.5"/>${[[80,20],[80,140],[40,60],[120,100],[80,100],[60,140],[100,140]].map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="'+(i===0?'6':'4')+'" fill="'+( i===0?'#FFE680':'#FACC15')+'" stroke="#FDE047" stroke-width="1"/>').join('')}</svg>`
  }
];

const DASHBOARD_CARDS = [
  // Tools
  { id: 'attendance', cat: 'tools', icon: '📋', name: 'Attendance Tracker', desc: 'Check Scouts in/out with printable meeting roster', tag: 'Tool' },
  { id: 'merit', cat: 'tools', icon: '🎖️', name: 'Merit Badge Tracker', desc: 'Track required & elective merit badges toward Eagle', tag: 'Tool' },
  { id: 'packing', cat: 'tools', icon: '🎒', name: 'Packing List Generator', desc: 'Customizable gear checklists by trip type', tag: 'Tool' },
  { id: 'roster', cat: 'tools', icon: '👥', name: 'Duty Roster Builder', desc: 'Assign Scouts to leadership roles', tag: 'Tool' },
  // Learning
  { id: 'field-guide', cat: 'learning', icon: '🌿', name: 'Florida Field Guide', desc: 'Wildlife, plants, and nature identification', tag: 'Learning' },
  { id: 'knots', cat: 'learning', icon: '🪢', name: 'Knot Library', desc: 'Essential Scout knots with step-by-step guides', tag: 'Learning' },
  { id: 'first-aid-guide', cat: 'learning', icon: '🏥', name: 'First Aid Handbook', desc: 'Flip cards covering emergency procedures', tag: 'Learning' },
  { id: 'survival-skills', cat: 'learning', icon: '🔥', name: 'Survival Skills', desc: '11 essential wilderness survival techniques', tag: 'Learning' },
  // Events
  { id: 'countdown', cat: 'events', icon: '⏱️', name: 'Campout Countdown Timer', desc: 'Live countdown to your next adventure', tag: 'Event' },
  { id: 'scoreboard', cat: 'events', icon: '🏆', name: 'Patrol Scoreboard', desc: 'Track patrol competition scores', tag: 'Event' },
  { id: 'menu', cat: 'events', icon: '🍳', name: 'Menu Planner', desc: 'Plan meals and generate shopping lists', tag: 'Event' },
  { id: 'registration', cat: 'events', icon: '📝', name: 'Event Registration', desc: 'Scout sign-up form with parent info', tag: 'Event' },
  // Games
  { id: 'star-quiz', cat: 'games', icon: '⭐', name: 'Star Navigation Quiz', desc: 'Identify constellations and navigate by stars', tag: 'Game' },
  { id: 'first-aid', cat: 'games', icon: '🩹', name: 'First Aid Simulator', desc: 'Make decisions in emergency scenarios', tag: 'Game' },
  { id: 'cipher', cat: 'games', icon: '🔐', name: 'Cipher Challenge', desc: 'Decode secret messages with pigpen cipher', tag: 'Game' },
  { id: 'story', cat: 'games', icon: '🔥', name: 'Campfire Story Builder', desc: 'Generate unique Scout adventure stories', tag: 'Game' },
  { id: 'games-hub', cat: 'games', icon: '🎮', name: 'More Games', desc: 'Return to the full games landing page', tag: 'Game', isLink: true }
];

const MB_REQUIRED = [
  'Camping', 'Cooking', 'First Aid', 'Citizenship in the Community',
  'Citizenship in the Nation', 'Citizenship in the World', 'Personal Fitness',
  'Environmental Science', 'Lifesaving', 'Swimming', 'Kayaking', 'Backpacking', 'Cycling'
];

const MB_ELECTIVE = [
  'Archery', 'Athletics', 'Canoeing', 'Chess', 'Climbing', 'Composite Materials',
  'Dentistry', 'Emergency Preparedness', 'Engineering', 'Entrepreneurship', 'Fishing',
  'Forestry', 'Game Design', 'Gardening', 'Geocaching', 'Geology', 'Gliding',
  'Golf', 'Graphic Arts', 'Hiking', 'Home Repairs', 'Horsemanship', 'Inventing',
  'Journalism', 'Leatherwork', 'Metalwork', 'Model Design and Building', 'Motorsports',
  'Music', 'Nature', 'Nuclear Science', 'Oceanography', 'Photography', 'Programming'
];

const PACKING_PRESETS = {
  weekend: {
    'Clothing': ['Shirt', 'Pants', 'Socks', 'Underwear', 'Jacket', 'Hat', 'Boots'],
    'Sleep System': ['Sleeping Bag', 'Sleeping Pad', 'Pillow'],
    'Hygiene': ['Toothbrush', 'Toothpaste', 'Soap', 'Towel'],
    'Cooking': ['Mess Kit', 'Water Bottle', 'Utensils'],
    'Safety': ['First Aid Kit', 'Flashlight', 'Whistle']
  },
  backpacking: {
    'Clothing': ['Hiking Shirt', 'Hiking Pants', 'Extra Socks', 'Underwear', 'Rain Jacket', 'Hat', 'Hiking Boots'],
    'Sleep System': ['Sleeping Bag', 'Sleeping Pad', 'Tent'],
    'Backpacking': ['Backpack', 'Water Filter', 'Food Bag'],
    'Navigation': ['Map', 'Compass', 'GPS Device'],
    'Safety': ['First Aid Kit', 'Flashlight', 'Emergency Shelter']
  },
  water: {
    'Clothing': ['Swimsuit', 'Shirt', 'Shorts', 'Water Shoes', 'Hat', 'Dry Clothes'],
    'Water Gear': ['Life Jacket', 'Towel', 'Dry Bag'],
    'Safety': ['First Aid Kit', 'Whistle', 'Sunscreen'],
    'Cooking': ['Cooler', 'Water Bottle', 'Snacks'],
    'Navigation': ['Map', 'Compass']
  },
  cold: {
    'Clothing': ['Thermal Underwear', 'Insulated Jacket', 'Insulated Pants', 'Wool Socks', 'Winter Hat', 'Gloves', 'Thermal Boots'],
    'Sleep System': ['Cold-rated Sleeping Bag', 'Sleeping Pad', 'Hot Water Bottle'],
    'Shelter': ['Winter Tent', 'Ground Tarp'],
    'Safety': ['First Aid Kit', 'Hand Warmers', 'Flashlight'],
    'Cooking': ['Stove', 'Fuel', 'Insulated Cup']
  },
  service: {
    'Work Gear': ['Work Gloves', 'Tool Belt', 'Closed-toe Shoes'],
    'Clothing': ['Work Shirt', 'Work Pants', 'Hat'],
    'Supplies': ['Trash Bags', 'Rakes', 'Shovels'],
    'Safety': ['First Aid Kit', 'Sunscreen', 'Water Bottle'],
    'Hygiene': ['Hand Wipes', 'Towel']
  }
};

const KNOT_DATA = [
  { name: 'Square Knot', use: 'Joining two ropes of similar diameter', steps: ['1. Hold one rope end in each hand', '2. Cross right over left', '3. Bring back to center, now cross left over right', '4. Pull tight'] },
  { name: 'Bowline', use: 'Creating a fixed loop at the end of a rope', steps: ['1. Make a small loop (rabbit hole)', '2. Bring the end up through the loop', '3. Around the standing line', '4. Back down through the loop', '5. Pull tight'] },
  { name: 'Clove Hitch', use: 'Securing a rope to a post or pole', steps: ['1. Wrap rope around the post', '2. Cross the end over the standing line', '3. Wrap around the post again', '4. Thread end under the last wrap'] },
  { name: 'Figure Eight', use: 'Stopping knot that won\'t slip through a hole', steps: ['1. Make a loop', '2. Cross end under standing line', '3. Bring end back up and through loop', '4. Pull tight'] },
  { name: 'Taut-line Hitch', use: 'Adjustable loop that won\'t slip under tension', steps: ['1. Make a loop with standing line', '2. Wrap end around standing line twice inside loop', '3. Bring end around outside of loop', '4. Pass end through the outer wrap'] },
  { name: 'Two Half Hitches', use: 'Quick and secure way to tie to a post', steps: ['1. Wrap rope around post and under standing line', '2. Bring end through the loop created', '3. Make another half hitch above the first', '4. Pull tight'] },
  { name: 'Reef Knot', use: 'Joining two ropes of equal size', steps: ['1. Cross right rope over left', '2. Bring back to center', '3. Cross left over right', '4. Pull tight and secure'] },
  { name: 'Girth Hitch', use: 'Attaching rope to a ring, strap, or another rope', steps: ['1. Loop rope through or around object', '2. Bring end across standing line', '3. Wrap back through the loop', '4. Pull tight'] },
  { name: 'Slip Knot', use: 'Quick-release knot that tightens under load', steps: ['1. Make a loop with working end', '2. Wrap end around standing line', '3. Bring end back through loop', '4. Leave loose until tightened by pull'] },
  { name: 'Sheet Bend', use: 'Joining two ropes of different sizes', steps: ['1. Make a loop with the thicker rope', '2. Thread thin rope through loop', '3. Bring thin rope around both parts of thick rope', '4. Thread under its own standing line'] },
  { name: 'Trucker\'s Hitch', use: 'Creating mechanical advantage for tensioning', steps: ['1. Make a loop in standing line', '2. Pass end around anchor point', '3. Thread end back through loop', '4. Pull down to tighten'] },
  { name: 'Timber Hitch', use: 'Securing rope to a log or timber', steps: ['1. Wrap rope around timber', '2. Bring end under standing line', '3. Wrap end around itself multiple times', '4. Pull tight'] },
  { name: 'Double Overhand Knot', use: 'Extra-secure stopping knot', steps: ['1. Make single overhand knot', '2. Wrap end around standing line again', '3. Pass end back through both loops', '4. Pull tight'] },
  { name: 'Anchor Hitch', use: 'Securing rope to an anchor point', steps: ['1. Wrap rope around anchor', '2. Create loop with working end', '3. Pass end under standing line through loop', '4. Cinch tight with half hitch'] },
  { name: 'Marlinspike Hitch', use: 'Temporary holding knot using a spike or stick', steps: ['1. Place spike or stick through rope loop', '2. Thread standing line under spike', '3. Hold standing line in place', '4. Remove spike when tightening complete'] }
];

const FIRST_AID_CARDS = [
  {
    name: 'Basic Wound Care',
    steps: '1. Stop bleeding with direct pressure 2. Clean with soap and water 3. Apply antibiotic ointment 4. Cover with sterile bandage 5. Change bandage daily'
  },
  {
    name: 'Burn Treatment',
    steps: '1. Cool burn with water for 10-15 minutes 2. Remove jewelry/tight items 3. Cover with clean, dry cloth 4. Take ibuprofen if needed 5. Seek medical help for severe burns'
  },
  {
    name: 'Fracture & Sprains',
    steps: '1. Immobilize the injured area 2. Apply ice wrapped in cloth for 15 minutes 3. Elevate above heart level 4. Support with sling or bandage 5. Seek medical evaluation'
  },
  {
    name: 'CPR Basics',
    steps: '1. Check responsiveness 2. Call emergency services 3. Position person on back 4. Perform chest compressions at 100-120/min 5. Give rescue breaths every 2 compressions'
  },
  {
    name: 'Shock Response',
    steps: '1. Lay person down with feet elevated 2. Keep warm with blankets 3. Stay calm and reassure 4. Do not give food or drink 5. Get emergency medical help immediately'
  },
  {
    name: 'Insect Stings',
    steps: '1. Remove stinger if visible 2. Wash area with soap and water 3. Apply cold compress 4. Take antihistamine if itchy 5. Seek help if allergic reaction'
  },
  {
    name: 'Head & Neck Injury',
    steps: '1. Do not move the person 2. Keep head and neck immobilized 3. Call emergency services 4. Monitor breathing and consciousness 5. Administer first aid until help arrives'
  },
  {
    name: 'Hypothermia & Heat Exhaustion',
    steps: '1. Move to appropriate temperature 2. Remove wet clothing (hypothermia) or excess clothing (heat) 3. Gradually warm/cool person 4. Offer water if conscious 5. Get medical help'
  },
  {
    name: 'Choking',
    steps: '1. Ask "Are you choking?" 2. Perform back blows (5 times) 3. Perform abdominal thrusts (5 times) 4. Repeat until object dislodges 5. Seek medical help if unresolved'
  },
  {
    name: 'Severe Bleeding',
    steps: '1. Apply direct pressure with clean cloth 2. Maintain pressure for 10-15 minutes 3. Add more cloth if needed (don\'t remove) 4. Elevate limb above heart 5. Call emergency services'
  }
];

const SURVIVAL_CARDS = [
  { name: 'Shelter Building', steps: 'Find natural shelter or build lean-to. Insulate from ground. Orient opening away from wind. Use leaves/pine for bedding.' },
  { name: 'Water Safety', steps: 'Purify water by boiling 1 minute, filtering, or using tablets. Never drink untreated water. Store in clean containers.' },
  { name: 'Fire Starting', steps: 'Gather tinder, kindling, and fuel wood. Build teepee or log cabin structure. Ignite tinder. Gradually add larger pieces.' },
  { name: 'Navigation', steps: 'Use map and compass together. Find terrain features. Use North Star at night. Follow water downhill to civilization.' },
  { name: 'Food Procurement', steps: 'Learn to identify edible plants (avoid unknown). Fish or set traps. Forage insects (protein source). Avoid toxic plants.' },
  { name: 'Camp Hygiene', steps: 'Dig cat hole 200 feet from water. Wash hands after bathroom. Filter and boil water. Keep food sealed from animals.' },
  { name: 'Rope & Knots', steps: 'Master Square, Bowline, and Clove Hitch. Practice until automatic. Know 10+ knots. Test all knots before relying on them.' },
  { name: 'Wilderness First Aid', steps: 'Treat injuries with available materials. Immobilize sprains. Control bleeding with pressure. Keep person warm and hydrated.' },
  { name: 'Night Survival', steps: 'Stay alert and calm. Use sound and smell (not just sight). Keep fire small. Know constellations for navigation.' },
  { name: 'Signaling & Communication', steps: 'Use whistle (3 blasts = distress). Build signal fire. Use mirror for reflection. Create ground-to-air signals.' },
  { name: '10 Essentials', steps: 'Map, compass, water, food, shelter, fire, first aid, light, repair kit, extra clothing. Carry always on hikes.' }
];

const FIELD_GUIDE = [
  // MAMMALS (25)
  { cat: 'mammals', emoji: '🦌', name: 'White-tailed Deer', desc: 'Most common large mammal. Cloven hoof tracks (heart-shaped). White flag tail when fleeing. Dawn/dusk near forest edges.' },
  { cat: 'mammals', emoji: '🦝', name: 'Raccoon', desc: 'Extremely common near campgrounds. Dexterous paws. Ringed tail, masked face. Will raid food storage. Bear bag all food.' },
  { cat: 'mammals', emoji: '🐻', name: 'Florida Black Bear', desc: 'Rare but present. 200-300 lbs. Shaggy black fur, rounded ears. Found in swamps and forests. Never approach.' },
  { cat: 'mammals', emoji: '🦊', name: 'Grey Fox', desc: 'Small canine, 3-4 lbs. Only fox that climbs trees. Salt-and-pepper colored. Nocturnal, rarely seen.' },
  { cat: 'mammals', emoji: '🦨', name: 'Striped Skunk', desc: 'Black with white stripe. 2-4 lbs. Known for spray defense. Nocturnal. Avoid if approached.' },
  { cat: 'mammals', emoji: '🐿️', name: 'Fox Squirrel', desc: 'Large squirrel, orange-red fur. Bushy tail. Common in oak forests. Diurnal, very active at dawn.' },
  { cat: 'mammals', emoji: '🦫', name: 'Beaver', desc: 'Large rodent, 30-60 lbs. Flat tail, orange teeth. Build dams in freshwater. Nocturnal.' },
  { cat: 'mammals', emoji: '🦌', name: 'Fallow Deer', desc: 'Non-native, similar to white-tailed. Spotted coat. Found in some central Florida areas.' },
  { cat: 'mammals', emoji: '🐰', name: 'Marsh Rabbit', desc: 'Small, reddish-brown. Lives in wetlands. Swims well. Rarely ventures far from water.' },
  { cat: 'mammals', emoji: '🐺', name: 'Coyote', desc: 'Medium canine, 30-40 lbs. Tan/grey fur. Expanding range in Florida. Nocturnal, hear howling at night.' },
  { cat: 'mammals', emoji: '🦥', name: 'Three-toed Sloth', desc: 'Slow, tree-dwelling. Long claws. Moss covers fur. Rare sightings in Florida.' },
  { cat: 'mammals', emoji: '🦨', name: 'Spotted Skunk', desc: 'Smaller than striped. White spots instead of stripes. Handstand before spraying.' },
  { cat: 'mammals', emoji: '🫃', name: 'Nutria', desc: 'Large rodent, orange teeth. Aquatic, like beavers. Invasive species. Destroys wetlands.' },
  { cat: 'mammals', emoji: '🦌', name: 'Axis Deer', desc: 'Non-native, spotted coat year-round. Chestnut color. Males have lyre-shaped antlers.' },
  { cat: 'mammals', emoji: '🐱', name: 'Kinkajou', desc: 'Tree-dwelling, fruit-loving. Golden-brown fur. Prehensile tail. Nocturnal.' },
  { cat: 'mammals', emoji: '🐭', name: 'Opossum', desc: 'White face, grey body. Plays dead when threatened. Immune to snake venom. Common.' },
  { cat: 'mammals', emoji: '🦔', name: 'Hedgehog', desc: 'Spiky ball when rolled up. Nocturnal. Eats insects. Non-native invasive.' },
  { cat: 'mammals', emoji: '🐭', name: 'Cotton Mouse', desc: 'Small, dark grey. Wood inhabitor. Excellent climber. Nests in trees.' },
  { cat: 'mammals', emoji: '🐭', name: 'Rice Rat', desc: 'Semi-aquatic, 4-5 inches. Found in marshes. Nocturnal swimmer.' },
  { cat: 'mammals', emoji: '🐱', name: 'Bobcat', desc: 'Tufted ears, spotted coat. Shy, elusive. Twice size of house cat. Solitary hunter.' },
  { cat: 'mammals', emoji: '🦊', name: 'Red Fox', desc: 'Reddish coat, white-tipped tail. Smaller than grey fox. Expanding into Florida.' },
  { cat: 'mammals', emoji: '🦡', name: 'Armadillo', desc: 'Armored shell, burrowing mammal. Curls when threatened. Can hold breath 6 minutes.' },
  { cat: 'mammals', emoji: '🌊', name: 'Manatee', desc: 'Large aquatic mammal, 800-1200 lbs. Vegetarian. Endangered. Peaceful herbivore.' },
  { cat: 'mammals', emoji: '🐬', name: 'Bottlenose Dolphin', desc: 'Marine mammal, intelligent. Coastal and river populations. Social pods. Playful.' },
  { cat: 'mammals', emoji: '🦭', name: 'Pinniped Seal', desc: 'Marine mammal, rare visitor. Cold water species. Occasional winter sightings.' },
  // REPTILES (25)
  { cat: 'reptiles', emoji: '🐊', name: 'American Alligator', desc: '6-14 ft long. Log-like shape near water. Eyes glow red in flashlight. Found in all freshwater.' },
  { cat: 'reptiles', emoji: '🐢', name: 'Gopher Tortoise', desc: 'Protected species. Domed shell, stumpy legs. Creates 10 ft deep burrows. Home to 350+ animal species.' },
  { cat: 'reptiles', emoji: '🐍', name: 'Eastern Diamondback Rattlesnake', desc: 'Largest venomous snake. Diamond pattern, triangular head. Loud rattle. Can reach 8 feet. Give wide berth.' },
  { cat: 'reptiles', emoji: '🦎', name: 'Green Anole', desc: 'Florida\'s native anole. Can change green to brown. Males show pink dewlap. Excellent insect controllers.' },
  { cat: 'reptiles', emoji: '🐍', name: 'Water Moccasin (Cottonmouth)', desc: 'Venomous, aquatic snake. Dark, heavy body. Found near water. White mouth when threatened.' },
  { cat: 'reptiles', emoji: '🐢', name: 'Florida Softshell Turtle', desc: 'Flat, leathery shell. Long neck, small head. Fast swimmers. Found in rivers and lakes.' },
  { cat: 'reptiles', emoji: '🦎', name: 'Florida Scrub Lizard', desc: 'Small, spiny. Only in Florida scrub habitat. Blue coloring on males. Extremely agile.' },
  { cat: 'reptiles', emoji: '🐢', name: 'Box Turtle', desc: 'Domed shell, hinged plastron. Brown coloring. Can close shell completely. Shy and slow-moving.' },
  { cat: 'reptiles', emoji: '🐍', name: 'Corn Snake', desc: 'Non-venomous, beautiful orange/red. Found in various habitats. Docile and beneficial.' },
  { cat: 'reptiles', emoji: '🦎', name: 'Leopard Gecko', desc: 'Spotted pattern, yellowish. Nocturnal. Non-native but established in some areas.' },
  { cat: 'reptiles', emoji: '🐍', name: 'Python (Burmese)', desc: 'Invasive, can reach 16 feet. Muscular body. Threat to native species. Established in Everglades.' },
  { cat: 'reptiles', emoji: '🐍', name: 'Indigo Snake', desc: 'Florida\'s largest snake, blue-black. Non-venomous but can bite. Vibrant blue scales. Rare and protected.' },
  { cat: 'reptiles', emoji: '🐢', name: 'Loggerhead Sea Turtle', desc: 'Ocean turtle, nests on beaches. Reddish-brown shell. Threatened species.' },
  { cat: 'reptiles', emoji: '🐢', name: 'Green Sea Turtle', desc: 'Ocean turtle, greenish shell. Herbivorous seagrass eater. Critically endangered.' },
  { cat: 'reptiles', emoji: '🐢', name: 'Leatherback Sea Turtle', desc: 'Largest sea turtle, leathery shell. Deep ocean diver. Endangered.' },
  { cat: 'reptiles', emoji: '🦎', name: 'Six-lined Racerunner', desc: 'Fast lizard, striped pattern. Open habitat runner. Active daytime.' },
  { cat: 'reptiles', emoji: '🦎', name: 'Fence Lizard', desc: 'Brown, tree climber. Territorial males do pushups. Excellent camouflage.' },
  { cat: 'reptiles', emoji: '🐍', name: 'Rat Snake (Black)', desc: 'Non-venomous, climbs excellently. Solid black adults. Beneficial rodent controller.' },
  { cat: 'reptiles', emoji: '🐊', name: 'American Crocodile', desc: 'Rare, 15-20 feet. V-shaped snout. Endangered. Only in Florida Keys/south.' },
  { cat: 'reptiles', emoji: '🦎', name: 'Curly-tailed Lizard', desc: 'Brownish, curls tail when threatened. Invasive. Bahama native. Assertive.' },
  { cat: 'reptiles', emoji: '🦎', name: 'Knight Anole', desc: 'Large bright green. Males have dewlaps. Caribbean native. Tree dweller.' },
  { cat: 'reptiles', emoji: '🐍', name: 'Garter Snake', desc: 'Striped pattern. Harmless. Eat frogs/fish. Adapt well to disturbance.' },
  { cat: 'reptiles', emoji: '🐍', name: 'Ribbon Snake', desc: 'Thin striped snake. Aquatic preference. Non-venomous. Graceful swimmer.' },
  { cat: 'reptiles', emoji: '🐍', name: 'Hognose Snake', desc: 'Upturned snout. Plays dead when threatened. Non-venomous. Toad specialist.' },
  // BIRDS (25)
  { cat: 'birds', emoji: '🦅', name: 'Bald Eagle', desc: 'Year-round resident. White head/tail only at age 4-5. 8 ft wingspan. Near lakes and coastlines.' },
  { cat: 'birds', emoji: '🦜', name: 'Roseate Spoonbill', desc: 'Unmistakable pink color. Spatula-shaped bill. Shallow water sweeper. Healthy wetland indicator.' },
  { cat: 'birds', emoji: '🦢', name: 'Sandhill Crane', desc: 'Tall grey birds, red forehead patch. Walk in pairs or families. Loud bugling call. Mate for life.' },
  { cat: 'birds', emoji: '🦅', name: 'Red-shouldered Hawk', desc: 'Medium raptor. Rufous shoulders, barred wings. Common in woodlands. Loud kee-ahh call.' },
  { cat: 'birds', emoji: '🐦', name: 'Florida Scrub Jay', desc: 'Bright blue and grey. Only in Florida scrub. Threatened species. Extremely curious, may land on you.' },
  { cat: 'birds', emoji: '🦉', name: 'Barred Owl', desc: 'Large, stocky owl. Rounded head, no ear tufts. Deep hooting call. Nocturnal hunter.' },
  { cat: 'birds', emoji: '🐦', name: 'Pileated Woodpecker', desc: 'Large black woodpecker, red crest. Loud drumming. Excavates large rectangular holes.' },
  { cat: 'birds', emoji: '🦅', name: 'Osprey', desc: 'Fish-hunting raptor. White underside, dark back. Hovers over water then dives. Builds large stick nests.' },
  { cat: 'birds', emoji: '🦢', name: 'White Ibis', desc: 'White plumage, long curved bill. Wades in shallow water. Colonial nesters. Seen in flocks.' },
  { cat: 'birds', emoji: '🦆', name: 'Wood Duck', desc: 'Colorful male, iridescent green. Perches in trees. Cavity nester. Dabbling dabbler, not a diver.' },
  { cat: 'birds', emoji: '🦢', name: 'Mute Swan', desc: 'Large white bird. Black bill. Invasive species. Aggressive to natives.' },
  { cat: 'birds', emoji: '🐦', name: 'Anhinga', desc: 'Water bird, long neck. Cormorant-like. Dries wings spread-eagled on branches.' },
  { cat: 'birds', emoji: '🦣', name: 'Great Blue Heron', desc: 'Large wading bird, 4-5 feet. Grey-blue. Stalks fish patiently. Prefers wetlands.' },
  { cat: 'birds', emoji: '🦣', name: 'Great Egret', desc: 'Large white wader. Long black legs, yellow bill. Breeding plumage stunning.' },
  { cat: 'birds', emoji: '🐦', name: 'Cattle Egret', desc: 'Small white heron. Follows cattle/livestock. Orange/buff breeding colors.' },
  { cat: 'birds', emoji: '🦅', name: 'Short-tailed Hawk', desc: 'Small raptor, soars high. Light and dark morphs. Graceful aerial hunter.' },
  { cat: 'birds', emoji: '🦆', name: 'American Coot', desc: 'Black diving duck. White bill and forehead. Lobed toes. Lakes and ponds.' },
  { cat: 'birds', emoji: '🦜', name: 'Monk Parakeet', desc: 'Green parrot, introduced. Builds large communal nests. Vocal, colorful.' },
  { cat: 'birds', emoji: '🐦', name: 'Mourning Dove', desc: 'Grey-brown, long-tailed. Distinctive cooing call. Ground feeder. Year-round.' },
  { cat: 'birds', emoji: '🦅', name: 'Swallow-tailed Kite', desc: 'Graceful raptor, deeply forked tail. Aerial insect hunter. Migratory.' },
  { cat: 'birds', emoji: '🦣', name: 'Brown Pelican', desc: 'Large water bird. Pouch for fish. Dives from high. State bird. Comeback species.' },
  { cat: 'birds', emoji: '🦢', name: 'Limpkin', desc: 'Brown wading bird. Long bill. Eats apple snails. Loud wailing cry.' },
  { cat: 'birds', emoji: '🐦', name: 'Purple Gallinule', desc: 'Colorful purple/blue. Yellow bill. Walks on lily pads. Wetland denizen.' },
  { cat: 'birds', emoji: '🐦', name: 'Yellow-rumped Warbler', desc: 'Winter visitor. Yellow patches. Abundant winter songbird. Active feeders.' },
  // INSECTS (25)
  { cat: 'insects', emoji: '🦋', name: 'Monarch Butterfly', desc: 'Orange/black, white spot border. Major migration corridor. Travel 3,000 miles. Fall migration peak.' },
  { cat: 'insects', emoji: '🦋', name: 'Swallowtail Butterfly', desc: 'Large, yellow with black stripes. Distinctive tail extensions on wings. Fast, erratic flight.' },
  { cat: 'insects', emoji: '🦗', name: 'Lubber Grasshopper', desc: 'Florida\'s largest grasshopper, yellow/black. Cannot fly, slow. Spray noxious liquid when threatened.' },
  { cat: 'insects', emoji: '🐝', name: 'Honeybee', desc: 'Essential pollinator. Golden/brown. Build hexagonal honeycomb. Colony of 20,000-80,000 bees.' },
  { cat: 'insects', emoji: '🦂', name: 'Florida Scorpion', desc: 'Small, yellow. Venomous but rarely fatal. Nocturnal. Glow under UV light.' },
  { cat: 'insects', emoji: '🕷️', name: 'Orb Weaver Spider', desc: 'Large, colorful. Build geometric webs. Beneficial insect controllers. Non-aggressive.' },
  { cat: 'insects', emoji: '🦗', name: 'Cricket', desc: 'Brown/black, chirping at night. Excellent hearing. Omnivorous. Important food source for wildlife.' },
  { cat: 'insects', emoji: '🦗', name: 'Damselfly', desc: 'Slender, colored wings. Predatory. Important wetland indicator. Hover over water.' },
  { cat: 'insects', emoji: '🦟', name: 'Mosquito', desc: 'Small blood-suckers. Only females bite. Disease carriers. Breeding in still water.' },
  { cat: 'insects', emoji: '🦜', name: 'Dragonfly', desc: 'Large wings, iridescent. Aerial hunters. Eat thousands of mosquitoes daily. Prehistoric lineage.' },
  { cat: 'insects', emoji: '🐝', name: 'Sweat Bee', desc: 'Small metallic bees. Attracted to human sweat. Non-aggressive. Important pollinators.' },
  { cat: 'insects', emoji: '🦂', name: 'Whip Scorpion', desc: 'Long tail-like appendage. Sprays acid. Harmless. Predatory insectivore.' },
  { cat: 'insects', emoji: '🦗', name: 'Camel Cricket', desc: 'Hump-backed, long legs. Nocturnal jumpers. Found in caves/dark places.' },
  { cat: 'insects', emoji: '🦗', name: 'Mole Cricket', desc: 'Burrowing cricket. Large front claws. Underground tunneler. Loud singing.' },
  { cat: 'insects', emoji: '🦋', name: 'Zebra Longwing', desc: 'Florida\'s state butterfly. Yellow/black stripes. Long-lived, 6 months. Social and inquisitive.' },
  { cat: 'insects', emoji: '🦋', name: 'Viceroy Butterfly', desc: 'Mimics Monarch. Orange/black. Edible but copycat pattern deters predators.' },
  { cat: 'insects', emoji: '🦗', name: 'Katydid', desc: 'Green insect, leaf-like wings. Loud katy-did call. Nocturnal. Summer sound.' },
  { cat: 'insects', emoji: '🕷️', name: 'Jumping Spider', desc: 'Huge forward-facing eyes. Excellent vision, jumps 40x body length. Curious, harmless.' },
  { cat: 'insects', emoji: '🦗', name: 'Cicada', desc: 'Large insect, loud buzzing. Shed exoskeletons. 13-17 year cycles. Summer sound.' },
  { cat: 'insects', emoji: '🦋', name: 'Painted Lady', desc: 'Orange/black/white wings. Migratory species. Fast fliers. Abundant some years.' },
  { cat: 'insects', emoji: '🦋', name: 'Buckeye Butterfly', desc: 'Eye-spots on wings. Brown with blue. Predator deterrent. Spring/summer.' },
  { cat: 'insects', emoji: '🐞', name: 'Beetle (Longhorn)', desc: 'Antennae longer than body. Wood borers. Various colors. Some invasive.' },
  { cat: 'insects', emoji: '🕷️', name: 'Wolf Spider', desc: 'Ground hunter, no web. Excellent eyesight. Carries babies on back. Beneficial.' },
  { cat: 'insects', emoji: '🐝', name: 'Bumble Bee', desc: 'Large fuzzy bee. Social colonies. Better cold tolerance. Excellent pollinators.' },
  // PLANTS (30)
  { cat: 'plants', emoji: '🌴', name: 'Sabal Palm', desc: 'Florida\'s state tree. Fan-shaped fronds. Tall tree, 40-50 feet. Salt-tolerant, storm-hardy.' },
  { cat: 'plants', emoji: '🌿', name: 'Spanish Moss', desc: 'Not a moss—epiphytic bromeliad. Hangs in grey-green curtains. Provides animal habitat. Non-parasitic.' },
  { cat: 'plants', emoji: '🌴', name: 'Saw Palmetto', desc: 'Low-growing fan palm. Razor-sharp serrated stems. Dense clusters in scrub. Wildlife food source.' },
  { cat: 'plants', emoji: '🌿', name: 'Firebush', desc: 'Native shrub, orange-red flowers. Spring-fall blooming. Attracts hummingbirds/butterflies. Great for projects.' },
  { cat: 'plants', emoji: '🌲', name: 'Longleaf Pine', desc: 'Tall pine, long needles. Important ecosystem. Requires periodic burning. Declining due to loss.' },
  { cat: 'plants', emoji: '🌲', name: 'Slash Pine', desc: 'Thick, rough bark. 60+ feet tall. Found throughout Florida. Fast growing.' },
  { cat: 'plants', emoji: '🌳', name: 'Live Oak', desc: 'Massive, spreading branches. Evergreen. Habitat for Spanish moss. Ancient specimens statewide.' },
  { cat: 'plants', emoji: '🌲', name: 'Cypress Tree', desc: 'Coniferous, found in wetlands. Knees emerge from water. Ancient trees. Beautiful fall colors.' },
  { cat: 'plants', emoji: '🌿', name: 'Palmetto Scrub', desc: 'Dense shrubland vegetation. Saw palmettos dominate. Low-growing, fire-adapted. Limited habitat.' },
  { cat: 'plants', emoji: '🌻', name: 'Coreopsis', desc: 'Yellow wildflower. Native to Florida. Spring blooming. Easy to grow, attracts butterflies.' },
  { cat: 'plants', emoji: '🌳', name: 'Mangrove', desc: 'Salt-water tree. Prop roots extend into water. Nursery for fish. Coastal protection.' },
  { cat: 'plants', emoji: '🌿', name: 'Cordgrass', desc: 'Marsh grass, golden color. Stabilizes shoreline. Fish nursery habitat. Salt-tolerant.' },
  { cat: 'plants', emoji: '🌿', name: 'Milkweed', desc: 'Purple flowers. Essential for Monarch caterpillars. Native wildflower. Easy to plant.' },
  { cat: 'plants', emoji: '🌿', name: 'Water Lily', desc: 'Floating aquatic plant. Pink/white flowers. Provides shelter for aquatic life. Slow-growing.' },
  { cat: 'plants', emoji: '🌿', name: 'Sea Oats', desc: 'Beach grass. Golden plumes. Holds sand dunes. Protected—never pick.' },
  { cat: 'plants', emoji: '🌻', name: 'Sunflower', desc: 'Large yellow petals. Tracks sun. Seed-filled center. Attracts pollinators.' },
  { cat: 'plants', emoji: '🌻', name: 'Black-eyed Susan', desc: 'Yellow petals, dark center. Native wildflower. Blooms summer/fall. Dry tolerant.' },
  { cat: 'plants', emoji: '🌿', name: 'Passion Flower Vine', desc: 'Intricate purple/white blooms. Host plant for Gulf Fritillary butterfly. Climbing vine.' },
  { cat: 'plants', emoji: '🌲', name: 'Bald Cypress', desc: 'Deciduous conifer. Knees in swamps. Reddish fall color. Massive specimens in Florida.' },
  { cat: 'plants', emoji: '🌳', name: 'Sweet Gum', desc: 'Star-shaped leaves. Spiky seed balls. Beautiful fall colors. Medicinal resin.' },
  { cat: 'plants', emoji: '🌳', name: 'Tupelo Tree', desc: 'Water-loving. Tupelo honey source. Pale wood. Coastal plain native.' },
  { cat: 'plants', emoji: '🌴', name: 'Cabbage Palm', desc: 'Edible heart (swamp cabbage). Fan fronds. Tall trunk. Evergreen.' },
  { cat: 'plants', emoji: '🌳', name: 'Persimmon', desc: 'Small tree, orange fruit. Astringent when unripe. Wildlife food source.' },
  { cat: 'plants', emoji: '🌿', name: 'Saw Grass', desc: 'Sharp-edged marsh grass. Everglades dominant. Razor-sharp blades.' },
  { cat: 'plants', emoji: '🌿', name: 'Blazing Star (Liatris)', desc: 'Purple spikes of flowers. Native wildflower. Butterfly magnet. Summer bloomer.' },
  { cat: 'plants', emoji: '🌿', name: 'Fern (Bracken)', desc: 'Common frond. Grows in dry areas. Unfurls in spring. Edible fiddleheads.' },
  { cat: 'plants', emoji: '🌿', name: 'Fern (Royal)', desc: 'Large elegant fronds. Wetland fern. Plume-like. Graceful structure.' },
  { cat: 'plants', emoji: '🌿', name: 'Venus Flytrap', desc: 'Carnivorous plant. Snap trap leaves. Native to Carolina, rare in FL. Endangered.' },
  { cat: 'plants', emoji: '🌿', name: 'Beggar Ticks', desc: 'Purple flowers. Spiky seed dispersal. Sticky burrs catch on clothes/animals.' },
  { cat: 'plants', emoji: '🌿', name: 'Wiregrass', desc: 'Tough narrow grass. Fire-adapted. Scrub specialist. Rare now.' },
  // AMPHIBIANS (6)
  { cat: 'amphibians', emoji: '🐸', name: 'American Bullfrog', desc: 'Large frog, 3-6 inches. Deep jug-o-rum call. Cannibalistic tadpoles. Found in freshwater.' },
  { cat: 'amphibians', emoji: '🐸', name: 'Treefrog', desc: 'Small, 1 inch. Green or brown. Tree dweller. Loud chirping chorus at night during breeding.' },
  { cat: 'amphibians', emoji: '🐸', name: 'Florida Newt', desc: 'Red eft stage bright orange. Aquatic as adults. Toxic skin. Live in wetlands and forests.' },
  { cat: 'amphibians', emoji: '🐸', name: 'Squirrel Treefrog', desc: 'Tiny, 0.75 inches. Green to brown. Tree percher. Loud aggressive call despite small size.' },
  { cat: 'amphibians', emoji: '🐸', name: 'Pig Frog', desc: 'Small, grunting call. Found in marshes. Burrows in mud. Nocturnal.' },
  { cat: 'amphibians', emoji: '🐸', name: 'Cane Toad', desc: 'Large, bumpy warty skin. Poisonous secretions. Invasive. Active at dusk/night.' },
];


// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════

export default function ScoutToolsPortal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPanel = searchParams.get('panel') || null;
  const [activePanel, setActivePanel] = useState(initialPanel);

  // Strip ?panel= from URL immediately after reading it
  useEffect(() => {
    if (searchParams.get('panel')) {
      navigate('/scout-portal', { replace: true });
    }
  }, [searchParams, navigate]);
  const [dashFilter, setDashFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Panel-specific state
  const [scouts, setScouts] = useState([]);
  const [meritChecked, setMeritChecked] = useState({});
  const [packingTrip, setPackingTrip] = useState('weekend');
  const [packingChecked, setPackingChecked] = useState({});
  const [rosterMembers] = useState([]);
  const [rosterAssignments, setRosterAssignments] = useState({});
  const [rosterSelected, setRosterSelected] = useState(null);
  const [fieldGuideFilter, setFieldGuideFilter] = useState('all');
  const [selectedGuideCard, setSelectedGuideCard] = useState(null);
  const [countdownTarget, setCountdownTarget] = useState(null);
  const [countdownDisplay, setCountdownDisplay] = useState({d:'000',h:'00',m:'00',s:'00'});
  const [countdownName, setCountdownName] = useState('Next Event');
  const [patrols] = useState([]);
  const [menuDays, setMenuDays] = useState(2);
  const [menuCurDay, setMenuCurDay] = useState(1);
  const [menuMeals, setMenuMeals] = useState({});
  const [regSuccess, setRegSuccess] = useState(false);
  const [quizState, setQuizState] = useState({phase:'intro',q:0,score:0,answered:false});
  const [cipherState, setCipherState] = useState({phase:'intro',msg:0,score:0,input:'',feedback:null});
  const [storyState, setStoryState] = useState({hero:'',setting:'Deep forest',challenge:'Survival emergency',output:null});

  // Countdown timer effect
  useEffect(() => {
    if (!countdownTarget || activePanel !== 'countdown') return;
    const interval = setInterval(() => {
      const diff = countdownTarget - new Date();
      if (diff < 0) {
        setCountdownDisplay({d:'🎉',h:'00',m:'00',s:'00'});
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdownDisplay({
        d: String(d).padStart(3,'0'),
        h: String(h).padStart(2,'0'),
        m: String(m).padStart(2,'0'),
        s: String(s).padStart(2,'0')
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownTarget, activePanel]);

  // Helper functions
  const goBack = () => {
    setActivePanel(null);
    setSidebarOpen(false);
  };

  const visibleCards = dashFilter === 'all' ? DASHBOARD_CARDS : DASHBOARD_CARDS.filter(c => c.cat === dashFilter);

  // Render functions for each panel
  const renderPanel = () => {
    switch(activePanel) {
      case 'attendance':
        return renderAttendance();
      case 'merit':
        return renderMerit();
      case 'packing':
        return renderPacking();
      case 'roster':
        return renderRoster();
      case 'field-guide':
        return renderFieldGuide();
      case 'knots':
        return renderKnots();
      case 'first-aid-guide':
        return renderFirstAidGuide();
      case 'survival-skills':
        return renderSurvivalSkills();
      case 'countdown':
        return renderCountdown();
      case 'scoreboard':
        return renderScoreboard();
      case 'menu':
        return renderMenu();
      case 'registration':
        return renderRegistration();
      case 'star-quiz':
        return renderStarQuiz();
      case 'first-aid':
        return renderFirstAidSimulator();
      case 'cipher':
        return renderCipher();
      case 'story':
        return renderStory();
      default:
        return null;
    }
  };

  // Placeholder render functions (will be expanded)
  const renderAttendance = () => (
    <div className="panel-inner">
      <h2>📋 Attendance Tracker</h2>
      <p className="panel-subtitle">Check scouts in and out of meetings</p>
      <div className="card" style={{marginBottom:'16px'}}>
        <div className="row" style={{marginBottom:'12px'}}>
          <input className="input" placeholder="Scout name" style={{flex:1}} />
          <button className="btn btn-sm" onClick={()=>{}}>+ Add Scout</button>
        </div>
      </div>
      <div className="scout-list">
        {scouts.map((s,i)=>(
          <div key={i} className="scout-row">
            <span className="scout-name">{s.name}</span>
            <div className="scout-status"><span className="pill">{s.present===null?'—':s.present?'✅':'❌'}</span></div>
            <button className="scout-del" onClick={()=>setScouts(scouts.filter((_,j)=>j!==i))}>🗑</button>
          </div>
        ))}
      </div>
      {scouts.length===0&&<p style={{color:'var(--mu)',textAlign:'center'}}>No scouts added yet</p>}
    </div>
  );

  const renderMerit = () => (
    <div className="panel-inner">
      <h2>🎖️ Merit Badge Tracker</h2>
      <p className="panel-subtitle">Track progress toward Eagle Scout</p>
      <div className="badge-progress-wrap">
        <div className="bp-label">
          <span>Eagle Required Badges</span>
          <span className="bp-pct">{Object.values(meritChecked).filter(v=>v).length}/{MB_REQUIRED.length}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{width:`${(Object.values(meritChecked).filter(v=>v).length/MB_REQUIRED.length)*100}%`}}></div>
        </div>
      </div>
      <div className="badge-section">
        <div className="badge-section-title">🏆 Required Badges (13)</div>
        <div className="badge-grid">
          {MB_REQUIRED.map((b,i)=>(
            <div key={i} className="badge-item">
              <input type="checkbox" checked={meritChecked[`req-${i}`]||false} onChange={(e)=>setMeritChecked({...meritChecked,[`req-${i}`]:e.target.checked})} />
              <label>{b}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="badge-section">
        <div className="badge-section-title">⭐ Elective Badges (33)</div>
        <div className="badge-grid">
          {MB_ELECTIVE.map((b,i)=>(
            <div key={i} className="badge-item">
              <input type="checkbox" />
              <label>{b}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPacking = () => (
    <div className="panel-inner">
      <h2>🎒 Packing List Generator</h2>
      <p className="panel-subtitle">Customizable gear checklists by trip type</p>
      <div className="card" style={{marginBottom:'16px'}}>
        <div className="label" style={{marginBottom:'12px'}}>Trip Type</div>
        <div className="trip-types">
          {Object.keys(PACKING_PRESETS).map(trip=>(
            <button key={trip} className={`trip-type ${packingTrip===trip?'active':''}`} onClick={()=>{setPackingTrip(trip);setPackingChecked({});}}>
              {trip.charAt(0).toUpperCase()+trip.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {Object.entries(PACKING_PRESETS[packingTrip]||{}).map(([section,items],i)=>(
        <div key={i}>
          <div className="pack-section">
            <div className="pack-section-title">📦 {section}</div>
            <div className="pack-items">
              {items.map((item,j)=>(
                <div key={j} className={`pack-item ${packingChecked[`${packingTrip}-${section}-${j}`]?'checked':''}`}>
                  <input type="checkbox" checked={packingChecked[`${packingTrip}-${section}-${j}`]||false} onChange={(e)=>setPackingChecked({...packingChecked,[`${packingTrip}-${section}-${j}`]:e.target.checked})} />
                  <label>{item}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div style={{marginTop:'20px',display:'flex',gap:'10px'}}>
        <button className="btn" onClick={()=>setPackingChecked({})}>↩️ Clear Checklist</button>
        <button className="btn btn-outline" onClick={()=>window.print()}>🖨️ Print</button>
      </div>
    </div>
  );

  const renderRoster = () => (
    <div className="panel-inner">
      <h2>👥 Duty Roster Builder</h2>
      <p className="panel-subtitle">Assign Scouts to leadership roles</p>
      <div className="card" style={{marginBottom:'16px'}}>
        <div className="label" style={{marginBottom:'10px'}}>Add Scout</div>
        <div className="row">
          <input className="input" placeholder="Scout name" style={{flex:1}} onChange={()=>{}} />
          <button className="btn btn-sm" onClick={()=>{}}>+ Add</button>
        </div>
      </div>
      <div className="roster-members">
        {rosterMembers.map((m,i)=>(
          <div key={i} className={`roster-member ${Object.values(rosterAssignments).includes(m)?'assigned':''}`} onClick={()=>setRosterSelected(m)}>
            {m}
          </div>
        ))}
      </div>
      <div className="roster-grid">
        {['SPL','ASPL','Quartermaster','Grubmaster','Camp Chef','KP','Fire Tender','Flag Ceremony','First Aider','Leave No Trace Lead'].map(role=>(
          <div key={role} className="roster-role">
            <div className="roster-role-name">{role}</div>
            <div className="roster-assign" style={{borderStyle:rosterAssignments[role]?'solid':'dashed'}} onClick={()=>setRosterAssignments({...rosterAssignments,[role]:rosterSelected})} >
              {rosterAssignments[role]||'—'}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:'10px'}}>
        <button className="btn" onClick={()=>setRosterAssignments({})}>🔄 Clear Assignments</button>
        <button className="btn btn-outline" onClick={()=>window.print()}>🖨️ Print</button>
      </div>
    </div>
  );

  const renderFieldGuide = () => (
    <div className="panel-inner">
      <h2>🌿 Florida Field Guide</h2>
      <p className="panel-subtitle">Wildlife, plants, and nature identification</p>
      <div className="guide-filter">
        {['all','mammals','reptiles','birds','insects','plants','amphibians'].map(cat=>(
          <button key={cat} className={`guide-tab ${fieldGuideFilter===cat?'active':''}`} onClick={()=>setFieldGuideFilter(cat)}>
            {cat.charAt(0).toUpperCase()+cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="guide-grid">
        {FIELD_GUIDE.filter(c=>fieldGuideFilter==='all'||c.cat===fieldGuideFilter).map((card,i)=>(
          <div key={i} className="guide-card" onClick={()=>setSelectedGuideCard(card)} style={{cursor:'pointer'}}>
            <div className="guide-emoji">{card.emoji}</div>
            <div className="guide-name">{card.name}</div>
            <div className="guide-type">{card.type}</div>
          </div>
        ))}
      </div>

      {selectedGuideCard && (
        <div className="modal-overlay" onClick={()=>setSelectedGuideCard(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setSelectedGuideCard(null)}>✕</button>
            <div className="modal-image-section">
              <div className="modal-emoji">{selectedGuideCard.emoji}</div>
            </div>
            <div className="modal-text-section">
              <h3>{selectedGuideCard.name}</h3>
              <p className="modal-type">{selectedGuideCard.type}</p>
              <p className="modal-desc">{selectedGuideCard.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderKnots = () => (
    <div className="panel-inner">
      <h2>🪢 Knot Library</h2>
      <p className="panel-subtitle">Essential Scout knots with step-by-step guides</p>
      <div className="knot-grid">
        {KNOT_DATA.map((knot,i)=>(
          <div key={i} className="knot-card">
            <div className="knot-emoji">🪢</div>
            <div className="knot-name">{knot.name}</div>
            <div className="knot-use">{knot.use}</div>
            <div className="knot-detail show" style={{display:'block',marginTop:'12px'}}>
              <div className="knot-steps">
                {knot.steps.map((step,j)=>(
                  <div key={j} className="knot-step">
                    <div className="step-n">{j+1}</div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFirstAidGuide = () => (
    <div className="panel-inner">
      <h2>🏥 First Aid Handbook</h2>
      <p className="panel-subtitle">Flip cards covering emergency procedures</p>
      <div className="badge-grid" style={{marginTop:'20px'}}>
        {FIRST_AID_CARDS.map((card,i)=>(
          <div key={i} className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div style={{fontSize:'28px'}}>🏥</div>
                <div style={{marginTop:'12px',fontWeight:'700'}}>{card.name}</div>
              </div>
              <div className="flip-card-back">
                <div style={{fontSize:'12px',lineHeight:'1.6',textAlign:'left'}}>{card.steps}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSurvivalSkills = () => (
    <div className="panel-inner">
      <h2>🔥 Survival Skills</h2>
      <p className="panel-subtitle">11 essential wilderness survival techniques</p>
      <div className="badge-grid" style={{marginTop:'20px'}}>
        {SURVIVAL_CARDS.map((card,i)=>(
          <div key={i} className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front" style={{background:'var(--goldb)',color:'white'}}>
                <div style={{fontSize:'28px'}}>🔥</div>
                <div style={{marginTop:'12px',fontWeight:'700'}}>{card.name}</div>
              </div>
              <div className="flip-card-back" style={{background:'var(--goldp)',color:'var(--gold)'}}>
                <div style={{fontSize:'12px',lineHeight:'1.6',textAlign:'left'}}>{card.steps}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCountdown = () => (
    <div className="panel-inner">
      <h2>⏱️ Campout Countdown Timer</h2>
      <p className="panel-subtitle">Live countdown to your next adventure</p>
      <div className="card" style={{marginBottom:'16px'}}>
        <div className="form-row" style={{marginBottom:'12px'}}>
          <div className="form-group">
            <div className="label">Event Name</div>
            <input className="input" placeholder="e.g. Summer Camp 2026" value={countdownName} onChange={(e)=>setCountdownName(e.target.value)} />
          </div>
          <div className="form-group">
            <div className="label">Event Date</div>
            <input className="input" type="date" onChange={(ev)=>{const d = new Date(ev.target.value+'T00:00:00'); setCountdownTarget(d);}} />
          </div>
        </div>
        <button className="btn" style={{width:'100%'}} onClick={()=>{}}>⏰ Start Countdown</button>
      </div>
      <div className="countdown-display">
        <div className="countdown-event">{countdownName}</div>
        <div className="countdown-time">
          <div className="cd-unit">
            <div className="cd-num">{countdownDisplay.d}</div>
            <div className="cd-lbl">Days</div>
          </div>
          <div className="cd-sep">:</div>
          <div className="cd-unit">
            <div className="cd-num">{countdownDisplay.h}</div>
            <div className="cd-lbl">Hours</div>
          </div>
          <div className="cd-sep">:</div>
          <div className="cd-unit">
            <div className="cd-num">{countdownDisplay.m}</div>
            <div className="cd-lbl">Mins</div>
          </div>
          <div className="cd-sep">:</div>
          <div className="cd-unit">
            <div className="cd-num">{countdownDisplay.s}</div>
            <div className="cd-lbl">Secs</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScoreboard = () => (
    <div className="panel-inner">
      <h2>🏆 Patrol Scoreboard</h2>
      <p className="panel-subtitle">Track patrol competition scores</p>
      <div className="card" style={{marginBottom:'16px'}}>
        <div className="row">
          <input className="input" placeholder="Patrol name" style={{flex:1}} />
          <button className="btn btn-sm" onClick={()=>{}}>+ Add Patrol</button>
        </div>
      </div>
      <div className="score-table">
        {patrols.sort((a,b)=>b.points-a.points).map((p,i)=>(
          <div key={i} className="score-row">
            <div className="score-rank">{'🥇🥈🥉'[i]||i+1}</div>
            <div className="score-patrol">{p.name}</div>
            <div className="score-pts">{p.points} pts</div>
            <div className="score-controls">
              <button className="score-btn plus" onClick={()=>{}}>+10</button>
              <button className="score-btn plus" onClick={()=>{}}>+5</button>
              <button className="score-btn minus" onClick={()=>{}}>−5</button>
              <button className="score-btn del" onClick={()=>{}}>🗑</button>
            </div>
          </div>
        ))}
      </div>
      {patrols.length===0&&<p style={{color:'var(--mu)',textAlign:'center'}}>Add patrols above to start</p>}
    </div>
  );

  const renderMenu = () => (
    <div className="panel-inner">
      <h2>🍳 Menu Planner</h2>
      <p className="panel-subtitle">Plan meals and generate shopping lists</p>
      <div className="card" style={{marginBottom:'14px'}}>
        <div className="label">Number of Days</div>
        <div className="row" style={{gap:'8px',flexWrap:'wrap'}}>
          {[2,3,4,5].map(n=>(
            <button key={n} className={`trip-type ${menuDays===n?'active':''}`} onClick={()=>{setMenuDays(n);setMenuCurDay(1);}}>
              {n} Days
            </button>
          ))}
        </div>
      </div>
      <div className="day-tabs">
        {Array.from({length:menuDays},(_, i)=>i+1).map(d=>(
          <button key={d} className={`day-tab ${menuCurDay===d?'active':''}`} onClick={()=>setMenuCurDay(d)}>
            Day {d}
          </button>
        ))}
      </div>
      <div className="meal-slots">
        {['Breakfast','Lunch','Dinner','Snacks'].map(meal=>(
          <div key={meal} className="meal-slot">
            <div className="meal-slot-name">{meal}</div>
            <input className="meal-slot-input" placeholder="What's on the menu?" value={menuMeals[`d${menuCurDay}-${meal}`]||''} onChange={(e)=>setMenuMeals({...menuMeals,[`d${menuCurDay}-${meal}`]:e.target.value})} />
          </div>
        ))}
      </div>
      <button className="btn" style={{width:'100%',marginBottom:'16px'}} onClick={()=>{}}>🛒 Generate Shopping List</button>
    </div>
  );

  const renderRegistration = () => (
    <div className="panel-inner">
      <h2>📝 Event Registration</h2>
      <p className="panel-subtitle">Scout sign-up form with parent info</p>
      {!regSuccess?(
        <div className="card">
          <div className="reg-form">
            <div className="form-row">
              <div className="form-group">
                <div className="label">Scout First Name *</div>
                <input className="input" placeholder="First name" />
              </div>
              <div className="form-group">
                <div className="label">Scout Last Name *</div>
                <input className="input" placeholder="Last name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="label">Parent Name *</div>
                <input className="input" placeholder="Full name" />
              </div>
              <div className="form-group">
                <div className="label">Phone *</div>
                <input className="input" placeholder="(407) 555-0100" type="tel" />
              </div>
            </div>
            <div className="form-group">
              <div className="label">Email</div>
              <input className="input" placeholder="parent@email.com" type="email" />
            </div>
            <button className="btn" style={{width:'100%'}}>✅ Submit Registration</button>
          </div>
        </div>
      ):(
        <div className="reg-success show">
          <div className="big">🎉</div>
          <h3>Registration Submitted!</h3>
          <p style={{color:'var(--mu)',fontSize:'14px',marginTop:'6px'}}>Scout registered successfully</p>
          <button className="btn" style={{marginTop:'16px'}} onClick={()=>setRegSuccess(false)}>+ Register Another Scout</button>
        </div>
      )}
    </div>
  );

  const renderStarQuiz = () => (
    <div className="panel-inner">
      <h2>⭐ Star Navigation Quiz</h2>
      <p className="panel-subtitle">Identify constellations and navigate by stars</p>
      {quizState.phase==='intro'?(
        <div className="card" style={{textAlign:'center',padding:'40px'}}>
          <div style={{fontSize:'48px',marginBottom:'16px'}}>⭐</div>
          <h3 style={{marginBottom:'12px'}}>Test Your Star Knowledge</h3>
          <p style={{color:'var(--mu)',marginBottom:'24px'}}>Learn to identify constellations used for navigation</p>
          <button className="btn" onClick={()=>setQuizState({...quizState,phase:'game'})}>Start Quiz</button>
        </div>
      ):quizState.phase==='game'?(
        <div className="card">
          <div className="q-counter">Question {quizState.q+1} of {STAR_QUIZ_DATA.length}</div>
          <h3 style={{marginTop:'16px',marginBottom:'4px'}}>{STAR_QUIZ_DATA[quizState.q].name}</h3>
          <p style={{color:'var(--mu)',fontSize:'13px'}}>💡 {STAR_QUIZ_DATA[quizState.q].hint}</p>
          <div className="constellation-display" dangerouslySetInnerHTML={{__html:STAR_QUIZ_DATA[quizState.q].svg}} />
          <div className="opts">
            {STAR_QUIZ_DATA[quizState.q].opts.map((opt,i)=>(
              <button key={i} className="opt-btn" onClick={()=>{if(opt===STAR_QUIZ_DATA[quizState.q].name)setQuizState({...quizState,score:quizState.score+1});setQuizState({...quizState,answered:true});}}>
                {opt}
              </button>
            ))}
          </div>
          {quizState.answered&&(
            <>
              <div className="fact show" style={{display:'block'}}>
                📚 {STAR_QUIZ_DATA[quizState.q].fact}
              </div>
              <button className="btn" style={{width:'100%',marginTop:'16px'}} onClick={()=>{if(quizState.q+1<STAR_QUIZ_DATA.length)setQuizState({phase:'game',q:quizState.q+1,score:quizState.score,answered:false});else setQuizState({phase:'result',q:quizState.q,score:quizState.score,answered:false});}}>
                {quizState.q+1<STAR_QUIZ_DATA.length?'Next Question':'See Results'}
              </button>
            </>
          )}
        </div>
      ):(
        <div className="card" style={{textAlign:'center',padding:'40px'}}>
          <div className="score-ring">{quizState.score}/{STAR_QUIZ_DATA.length}</div>
          <h3 style={{marginTop:'16px'}}>Quiz Complete!</h3>
          <p style={{color:'var(--mu)',marginTop:'12px'}}>You got {quizState.score} out of {STAR_QUIZ_DATA.length} correct</p>
          <button className="btn" style={{marginTop:'24px'}} onClick={()=>setQuizState({phase:'intro',q:0,score:0,answered:false})}>Try Again</button>
        </div>
      )}
    </div>
  );

  const renderFirstAidSimulator = () => (
    <div className="panel-inner">
      <h2>🩹 First Aid Simulator</h2>
      <p className="panel-subtitle">Make decisions in emergency scenarios</p>
      <div className="card" style={{textAlign:'center',padding:'40px'}}>
        <div style={{fontSize:'48px',marginBottom:'16px'}}>🩹</div>
        <p style={{color:'var(--mu)'}}>First Aid Simulator - Coming Soon</p>
      </div>
    </div>
  );

  const renderCipher = () => (
    <div className="panel-inner">
      <h2>🔐 Cipher Challenge</h2>
      <p className="panel-subtitle">Decode secret messages with pigpen cipher</p>
      {cipherState.phase==='intro'?(
        <div className="card" style={{textAlign:'center',padding:'40px'}}>
          <div style={{fontSize:'48px',marginBottom:'16px'}}>🔐</div>
          <h3 style={{marginBottom:'12px'}}>Pigpen Cipher Decoder</h3>
          <p style={{color:'var(--mu)',marginBottom:'24px'}}>Decode 6 secret Scout messages</p>
          <button className="btn" onClick={()=>setCipherState({...cipherState,phase:'game'})}>Start Game</button>
        </div>
      ):(
        <div className="card">
          <div className="q-counter">Message {cipherState.msg+1} of 6</div>
          <div style={{marginTop:'16px'}}>
            <div className="cipher-display">⬜⬜⬜⬜⬜</div>
            <input className="input" placeholder="Decoded message" style={{marginTop:'12px'}} value={cipherState.input} onChange={(e)=>setCipherState({...cipherState,input:e.target.value.toUpperCase()})} />
            <button className="btn" style={{width:'100%',marginTop:'12px'}} onClick={()=>{}}>Check Answer</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStory = () => (
    <div className="panel-inner">
      <h2>🔥 Campfire Story Builder</h2>
      <p className="panel-subtitle">Generate unique Scout adventure stories</p>
      {!storyState.output?(
        <div className="card">
          <div className="form-group" style={{marginBottom:'16px'}}>
            <div className="label">Scout Name</div>
            <input className="input" placeholder="Your Scout name" value={storyState.hero} onChange={(e)=>setStoryState({...storyState,hero:e.target.value})} />
          </div>
          <div className="form-group" style={{marginBottom:'16px'}}>
            <div className="label">Setting</div>
            <select className="select" value={storyState.setting} onChange={(e)=>setStoryState({...storyState,setting:e.target.value})}>
              <option>Deep forest</option>
              <option>Mountain peak</option>
              <option>Mysterious cave</option>
              <option>Abandoned camp</option>
              <option>Stormy lake</option>
            </select>
          </div>
          <div className="form-group" style={{marginBottom:'16px'}}>
            <div className="label">Challenge</div>
            <select className="select" value={storyState.challenge} onChange={(e)=>setStoryState({...storyState,challenge:e.target.value})}>
              <option>Survival emergency</option>
              <option>Lost scout</option>
              <option>Wildlife encounter</option>
              <option>Equipment failure</option>
              <option>Weather disaster</option>
            </select>
          </div>
          <button className="btn" style={{width:'100%'}} onClick={()=>{const stories=['Once upon a time, '+storyState.hero+' ventured into the '+storyState.setting+' facing a '+storyState.challenge+'. With Scout skills learned at Troop 242, they overcame every obstacle and emerged as a true leader.','The tale of '+storyState.hero+' begins in the heart of the '+storyState.setting+'. When faced with a '+storyState.challenge+', their training and courage saved the day.','Legend has it that '+storyState.hero+' once explored the '+storyState.setting+' and encountered a '+storyState.challenge+'. What happened next became Scout history.'];setStoryState({...storyState,output:stories[Math.floor(Math.random()*stories.length)]});}}>
            ✨ Generate Story
          </button>
        </div>
      ):(
        <div className="card">
          <div className="story-output show" style={{display:'block'}}>
            {storyState.output}
          </div>
          <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>
            <button className="btn" style={{flex:1}} onClick={()=>setStoryState({...storyState,output:null})}>📝 Create Another</button>
            <button className="btn btn-outline" onClick={()=>window.print()}>🖨️ Print</button>
          </div>
        </div>
      )}
    </div>
  );

  


  

  

  return (
    <div className="scout-portal">
      {/* HEADER */}
      <header className="scout-portal-header">
        <div className="header-content">
          <button className="menu-btn" onClick={()=>setSidebarOpen(!sidebarOpen)}>☰</button>
          <a href="#" className="home-link" onClick={(e)=>{e.preventDefault();navigate('/');}}>
          <div className="header-brand">
            <span className="brand-icon">⚜️</span>
            <div>
              <h1 className="brand-name">Troop 242</h1>
               <p className="brand-tagline">Sanford • Central Florida</p>
            </div>
          </div></a>
          <div className="header-brand">
           
            <div>
              <h1 className="brand-name">Scout Portal</h1>
            </div>
          </div>
          <div className="header-actions">
            {activePanel && (
              <button className="btn-back" onClick={goBack}>
                ← Back to Dashboard
              </button>
            )}
          </div>
        </div>
      </header>

      {/* OVERLAY (mobile) */}
      <div className={`overlay ${sidebarOpen?'show':''}`} onClick={()=>setSidebarOpen(false)}></div>

      {/* LAYOUT */}
      <div className="app-body">
        {/* SIDEBAR */}
        <div className={`sidebar ${sidebarOpen?'open':''}`}>
          <div className="nav-section">
            <div className="nav-section-title">🛠️ Tools</div>
            {['attendance','merit','packing','roster'].map(id=>{
              const card = DASHBOARD_CARDS.find(c=>c.id===id);
              return (
                <button key={id} className={`nav-item ${activePanel===id?'active':''}`} onClick={()=>{setActivePanel(id);setSidebarOpen(false);}}>
                  <span className="nav-icon">{card.icon}</span>
                  {card.name}
                </button>
              );
            })}
          </div>
          <div className="nav-divider"></div>
          <div className="nav-section">
            <div className="nav-section-title">📚 Learning</div>
            {['field-guide','knots','first-aid-guide','survival-skills'].map(id=>{
              const card = DASHBOARD_CARDS.find(c=>c.id===id);
              return (
                <button key={id} className={`nav-item ${activePanel===id?'active':''}`} onClick={()=>{setActivePanel(id);setSidebarOpen(false);}}>
                  <span className="nav-icon">{card.icon}</span>
                  {card.name}
                </button>
              );
            })}
          </div>
          <div className="nav-divider"></div>
          <div className="nav-section">
            <div className="nav-section-title">🏕️ Events</div>
            {['countdown','scoreboard','menu','registration'].map(id=>{
              const card = DASHBOARD_CARDS.find(c=>c.id===id);
              return (
                <button key={id} className={`nav-item ${activePanel===id?'active':''}`} onClick={()=>{setActivePanel(id);setSidebarOpen(false);}}>
                  <span className="nav-icon">{card.icon}</span>
                  {card.name}
                </button>
              );
            })}
          </div>
          <div className="nav-divider"></div>
          <div className="nav-section">
            <div className="nav-section-title">🎮 Games</div>
            {['star-quiz','first-aid','cipher','story','knot-challenge','badge-quest','survival-game','nature-matcher','games-hub'].map(id=>{
              const card = DASHBOARD_CARDS.find(c=>c.id===id);
              return (
                <button key={id} className={`nav-item ${activePanel===id?'active':''}`} onClick={()=>{
                  if(card.isLink) {
                    navigate('/games');
                  } else {
                    setActivePanel(id);
                    setSidebarOpen(false);
                  }
                }}>
                  <span className="nav-icon">{card.icon}</span>
                  {card.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          {!activePanel?(
            // DASHBOARD
            <div id="dashboard">
              <div className="dash-hero">
                <h2>Welcome to Scout Portal</h2>
                <p>Tools, learning, games, and event management for Troop 242 Scouts</p>
              </div>
              <div className="cat-tabs">
                {['all','tools','learning','events','games'].map(cat=>(
                  <button key={cat} className={`cat-tab ${dashFilter===cat?'active':''}`} onClick={()=>setDashFilter(cat)}>
                    {cat==='all'?`All (${DASHBOARD_CARDS.length})`:cat==='tools'?'🛠️ Tools':cat==='learning'?'📚 Learning':cat==='events'?'🏕️ Events':'🎮 Games'}
                  </button>
                ))}
              </div>
              <div className="dash-grid">
                {visibleCards.map(card=>(
                  <div key={card.id} className="feat-card" onClick={()=>{
                    if(card.isLink) {
                      navigate('/games');
                    } else {
                      setActivePanel(card.id);
                    }
                  }}>
                    <span className="feat-icon">{card.icon}</span>
                    <div className="feat-name">{card.name}</div>
                    <div className="feat-desc">{card.desc}</div>
                    <span className="feat-tag pill white">{card.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          ):(
            // PANEL
            <div className="panel active">
              {renderPanel()}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="scout-portal-footer">
        <div className="footer-content">
          <p className="footer-text">
            © 2026 Troop 242 Sanford • <span className="footer-divider">|</span> Scouting America
          </p>
          <p className="footer-subtext">Adventure • Brotherhood • Service</p>
        </div>
      </footer>
    </div>
  );
}
