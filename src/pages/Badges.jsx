
import { Search, ArrowRight, ExternalLink } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Merit badge PDF URLs mapping
export const BADGE_PDF_URLS = {
  'Camping': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Camping.pdf',
  'Cooking': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Cooking.pdf',
  'First Aid': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/First%20Aid.pdf',
  'Citizenship in the Community': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Citizenship%20in%20the%20Community.pdf',
  'Citizenship in the Nation': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Citizenship%20in%20the%20Nation.pdf',
  'Citizenship in the World': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Citizenship%20in%20the%20World.pdf',
  'Citizenship in Society': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Citizenship%20in%20Society.pdf',
  'Communication': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Communication.pdf',
  'Emergency Preparedness': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Emergency%20Preparedness.pdf',
  'Environmental Science': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Environmental%20Science.pdf',
  'Personal Fitness': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Personal%20Fitness.pdf',
  'Lifesaving': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Lifesaving.pdf',
  'Swimming': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Swimming.pdf',
  'Leadership': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Leadership.pdf',
  'Public Speaking': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Public%20Speaking.pdf',
  'Family Life': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Family%20Life.pdf',
  'Personal Safety': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Personal%20Safety.pdf',
  'Safety': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Safety.pdf',
  'Crime Prevention': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Crime%20Prevention.pdf',
  'Disabilities Awareness': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Disabilities%20Awareness.pdf',
  'Diversity and Inclusion': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Diversity%20and%20Inclusion.pdf',
  'United Nations': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/United%20Nations.pdf',
  'Business': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Business.pdf',
  'Entrepreneurship': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Entrepreneurship.pdf',
  'Personal Management': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Personal%20Management.pdf',
  'Debt Management': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Debt%20Management.pdf',
  'Scholarship': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Scholarship.pdf',
  'Salesmanship': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Salesmanship.pdf',
  'Inventing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Inventing.pdf',
  'Lifeguard': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Lifeguard.pdf',
  'Small Business Management': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Small%20Business%20Management.pdf',
  'American Heritage': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/American%20Heritage.pdf',
  'American Cultures': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/American%20Cultures.pdf',
  'American Indian Culture': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/American%20Indian%20Culture.pdf',
  'American Business': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/American%20Business.pdf',
  'American Labor': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/American%20Labor.pdf',
  'Mining in Society': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Mining%20in%20Society.pdf',
  'Composite Materials': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Composite%20Materials.pdf',
  'Nuclear Science': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Nuclear%20Science.pdf',
  'Sustainability': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Sustainability.pdf',
  'Energy': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Energy.pdf',
  'Maritime Exploration': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Maritime%20Exploration.pdf',
  'Money Management': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Money%20Management.pdf',
  'Stamp Collecting': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Stamp%20Collecting.pdf',
  'Coin Collecting': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Coin%20Collecting.pdf',
  'Archaeology': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Archaeology.pdf',
  'Genealogy': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Genealogy.pdf',
  'Fingerprinting': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Fingerprinting.pdf',
  'Pets': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Pets.pdf',
  'Dog Care': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Dog%20Care.pdf',
  'Horse': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Horsemanship.pdf',
  'Nutrition': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Nutrition.pdf',
  'Pulp and Paper': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Pulp%20and%20Paper.pdf',
  'Beekeeping': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Beekeeping.pdf',
  'Woodcarving': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Woodcarving.pdf',
  'Chess': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Chess.pdf',
  'Multisport': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Multisport.pdf',
  'Drafting': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Drafting.pdf',
  'Game Design': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Game%20Design.pdf',
  'Painting': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Painting.pdf',
  'Sculpture': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Sculpture.pdf',
  'Music': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Music.pdf',
  'Theater': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Theater.pdf',
  'Writing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Writing.pdf',
  'Reading': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Reading.pdf',
  'Journalism': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Journalism.pdf',
  'Graphic Arts': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Graphic%20Arts.pdf',
  'Woodwork': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Woodwork.pdf',
  'Leatherwork': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Leatherwork.pdf',
  'Pottery': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Pottery.pdf',
  'Metalwork': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Metalwork.pdf',
  'Model Design and Building': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Model%20Design%20and%20Building.pdf',
  'Collections': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Collections.pdf',
  'Basketry': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Basketry.pdf',
  'Animation': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Animation.pdf',
  'Digital Arts and Photography': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Digital%20Arts%20and%20Photography.pdf',
  'Textile and Fiber Arts': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Textile%20and%20Fiber%20Arts.pdf',
  'Archery': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Archery.pdf',
  'Water Sports': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Water%20Sports.pdf',
  'Rifle Shooting': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Rifle%20Shooting.pdf',
  'Shotgun Shooting': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Shotgun%20Shooting.pdf',
  'Cycling': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Cycling.pdf',
  'Sports': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Sports.pdf',
  'Fitness': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Fitness.pdf',
  'Physical Fitness': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Personal%20Fitness.pdf',
  'Skating': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Skating.pdf',
  'Snow Sports': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Snow%20Sports.pdf',
  'Golf': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Golf.pdf',
  'Horsemanship': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Horsemanship.pdf',
  'Hang Gliding': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Hang%20Gliding.pdf',
  'Hiking': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Hiking.pdf',
  'Backpacking': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Backpacking.pdf',
  'Fire Safety': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Fire%20Safety.pdf',
  'Wilderness Survival': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Wilderness%20Survival%20Skills.pdf',
  'Orienteering': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Orienteering.pdf',
  'Pioneering': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Pioneering.pdf',
  'Soil and Water Conservation': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Soil%20and%20Water%20Conservation.pdf',
  'Gardening': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Gardening.pdf',
  'Forestry': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Forestry.pdf',
  'Weather': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Weather.pdf',
  'Whitewater Rafting': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Whitewater.pdf',
  'Snowsports': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Snow%20Sports.pdf',
  'Kayaking': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Kayaking.pdf',
  'Canoeing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Canoeing.pdf',
  'Small-Boat Sailing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Small-Boat%20Sailing.pdf',
  'Scuba Diving': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Scuba%20Diving.pdf',
  'Motorboating': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Motorboating.pdf',
  'Rowing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Rowing.pdf',
  'Fishing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Fishing.pdf',
  'Fly Fishing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Fly%20Fishing.pdf',
  'Fish & Wildlife Management': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Fish%20and%20Wildlife%20Management.pdf',
  'Snorkeling': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Snorkeling.pdf',
  'Surfing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Surfing.pdf',
  'Water Skiing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Water%20Skiing.pdf',
  'Climbing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Climbing.pdf',
  'Geocaching': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Geocaching.pdf',
  'Whitewater': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Whitewater.pdf',
  'Bugling': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Bugling.pdf',
  'Signs, Signals, and Codes': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Signs%20Signals%20and%20Codes.pdf',
  'Scouting Heritage': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Scouting%20Heritage.pdf',
  'Search and Rescue': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Search%20and%20Rescue.pdf',
  'Rappelling': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Rappelling.pdf',
  'Skydiving': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Skydiving.pdf',
  'Programming': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Programming.pdf',
  'Robotics': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Robotics.pdf',
  'Artificial Intelligence': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Artificial%20Intelligence.pdf',
  'Digital Technology': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Digital%20Technology.pdf',
  'Electronics': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Electronics.pdf',
  'Cybersecurity': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Cybersecurity.pdf',
  'Radio': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Radio.pdf',
  'Moviemaking': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Moviemaking.pdf',
  'Photography': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Photography.pdf',
  'Coding': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Coding.pdf',
  '3D Printing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/3D%20Printing.pdf',
  'Drone Technology': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Drone%20Technology.pdf',
  'Masonry': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Masonry.pdf',
  'Astronomy': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Astronomy.pdf',
  'Space Exploration': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Space%20Exploration.pdf',
  'Chemistry': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Chemistry.pdf',
  'Geology': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Geology.pdf',
  'Oceanography': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Oceanography.pdf',
  'Plant Science': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Plant%20Science.pdf',
  'Botany': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Botany.pdf',
  'Zoology': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Zoology.pdf',
  'Bird Study': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Bird%20Study.pdf',
  'Mammal Study': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Mammal%20Study.pdf',
  'Insect Study': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Insect%20Study.pdf',
  'Reptile and Amphibian Study': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Reptile%20and%20Amphibian%20Study.pdf',
  'Nature': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Nature.pdf',
  'Microbiology': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Microbiology.pdf',
  'Physics': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Physics.pdf',
  'Paleontology': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Paleontology.pdf',
  'Water Safety': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Water%20Safety.pdf',
  'Engineering': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Engineering.pdf',
  'Architecture': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Architecture.pdf',
  'Construction': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Construction.pdf',
  'Plumbing': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Plumbing.pdf',
  'Automotive Maintenance': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Automotive%20Maintenance.pdf',
  'Welding': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Welding.pdf',
  'Electricity': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Electricity.pdf',
  'Farm Mechanics': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Farm%20Mechanics.pdf',
  'Landscape Architecture': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Landscape%20Architecture.pdf',
  'Law': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Law.pdf',
  'Medicine': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Medicine.pdf',
  'Health Care Professions': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Health%20Care%20Professions.pdf',
  'Public Health': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Public%20Health.pdf',
  'Dentistry': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Dentistry.pdf',
  'Veterinary Medicine': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Veterinary%20Medicine.pdf',
  'Teaching': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Teaching.pdf',
  'Surveying': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Surveying.pdf',
  'Railroading': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Railroading.pdf',
  'Truck Transportation': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Truck%20Transportation.pdf',
  'Military Service': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Military%20Service.pdf',
  'Farmer': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Farming.pdf',
  'Horticulture': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Horticulture.pdf',
  'Environmental Conservation': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Environmental%20Conservation.pdf',
  'Aviation': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Aviation.pdf',
  'Automotive Repair': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Automotive%20Repair.pdf',
  'Animal Science': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Animal%20Science.pdf',
  'Art': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Art.pdf',
  'Athletics': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Athletics.pdf',
  'Exploration': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Exploration.pdf',
  'Home Repairs': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Home%20Repairs.pdf',
  'Traffic Safety': 'https://filestore.scouting.org/filestore/Merit_Badge_ReqandRes/Pamphlets/Traffic%20Safety.pdf',
};

export const BADGE_CATEGORIES = [
  {
    category: 'Eagle Required',
    emoji: '🦅',
    description: 'The 13 required badges for Eagle Scout rank (Mandatory + Choose One from each group)',
    badges: [
      { name: '━━━━ MANDATORY (10 Required) ━━━━', url: '', isHeader: true },
      { name: '✓ First Aid', url: 'https://www.scouting.org/merit-badges/first-aid/' },
      { name: '✓ Citizenship in the Community', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-community/' },
      { name: '✓ Citizenship in the Nation', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-nation/' },
      { name: '✓ Citizenship in the World', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-world/' },
      { name: '✓ Communication', url: 'https://www.scouting.org/merit-badges/communication/' },
      { name: '✓ Cooking', url: 'https://www.scouting.org/merit-badges/cooking/' },
      { name: '✓ Personal Fitness', url: 'https://www.scouting.org/merit-badges/personal-fitness/' },
      { name: '✓ Personal Management', url: 'https://www.scouting.org/merit-badges/personal-management/' },
      { name: '✓ Camping', url: 'https://www.scouting.org/merit-badges/camping/' },
      { name: '✓ Family Life', url: 'https://www.scouting.org/merit-badges/family-life/' },
      { name: '━━━━ CHOOSE 1: Health & Safety ━━━━', url: '', isHeader: true },
      { name: '⭐ Emergency Preparedness', url: 'https://www.scouting.org/merit-badges/emergency-preparedness/' },
      { name: '⭐ Lifesaving', url: 'https://www.scouting.org/merit-badges/lifesaving/' },
      { name: '━━━━ CHOOSE 1: Environment ━━━━', url: '', isHeader: true },
      { name: '⭐ Environmental Science', url: 'https://www.scouting.org/merit-badges/environmental-science/' },
      { name: '⭐ Sustainability', url: 'https://www.scouting.org/merit-badges/sustainability/' },
      { name: '━━━━ CHOOSE 1: Outdoor Skills ━━━━', url: '', isHeader: true },
      { name: '⭐ Swimming', url: 'https://www.scouting.org/merit-badges/swimming/' },
      { name: '⭐ Hiking', url: 'https://www.scouting.org/merit-badges/hiking/' },
      { name: '⭐ Cycling', url: 'https://www.scouting.org/merit-badges/cycling/' }
    ]
  },
  {
    category: 'Easiest Merit Badges - Home',
    emoji: '🏡',
    description: 'Complete these badges at home with ease',
    badges: [
      { name: 'Chess', url: 'https://www.scouting.org/merit-badges/chess/' },
      { name: 'Citizenship in the World', url: 'https://www.scouting.org/merit-badges/citizenship-in-the-world/' },
      { name: 'Environmental Science', url: 'https://www.scouting.org/merit-badges/environmental-science/' },
      { name: 'Family Life', url: 'https://www.scouting.org/merit-badges/family-life/' },
      { name: 'Fingerprinting', url: 'https://www.scouting.org/merit-badges/fingerprinting/' },
      { name: 'First Aid', url: 'https://www.scouting.org/merit-badges/first-aid/' },
      { name: 'Home Repairs', url: 'https://www.scouting.org/merit-badges/home-repairs/' },
      { name: 'Mammal Study', url: 'https://www.scouting.org/merit-badges/mammal-study/' },
      { name: 'Sustainability', url: 'https://www.scouting.org/merit-badges/sustainability/' }
    ]
  },
  {
    category: 'Outdoor Adventures',
    emoji: '🏕️',
    description: 'Explore nature and outdoor skills',
    badges: [
      { name: 'Backpacking', url: 'https://www.scouting.org/merit-badges/backpacking/' },
      { name: 'Orienteering', url: 'https://www.scouting.org/merit-badges/orienteering/' },
      { name: 'Wilderness Survival', url: 'https://www.scouting.org/merit-badges/wilderness-survival-skills/' },
      { name: 'Pioneering', url: 'https://www.scouting.org/merit-badges/pioneering/' },
      { name: 'Geocaching', url: 'https://www.scouting.org/merit-badges/geocaching/' },
      { name: 'Fire Safety', url: 'https://www.scouting.org/merit-badges/fire-safety/' }
    ]
  },
  {
    category: 'Water Sports',
    emoji: '🚣',
    description: 'Master water-based activities',
    badges: [
      { name: 'Canoeing', url: 'https://www.scouting.org/merit-badges/canoeing/' },
      { name: 'Kayaking', url: 'https://www.scouting.org/merit-badges/kayaking/' },
      { name: 'Small-Boat Sailing', url: 'https://www.scouting.org/merit-badges/small-boat-sailing/' },
      { name: 'Rowing', url: 'https://www.scouting.org/merit-badges/rowing/' },
      { name: 'Motorboating', url: 'https://www.scouting.org/merit-badges/motorboating/' },
      { name: 'Fishing', url: 'https://www.scouting.org/merit-badges/fishing/' },
      { name: 'Fly Fishing', url: 'https://www.scouting.org/merit-badges/fly-fishing/' },
      { name: 'Scuba Diving', url: 'https://www.scouting.org/merit-badges/scuba-diving/' },
      { name: 'Water Sports', url: 'https://www.scouting.org/merit-badges/water-sports/' },
      { name: 'Whitewater', url: 'https://www.scouting.org/merit-badges/whitewater/' }
    ]
  },
  {
    category: 'Sports & Athletics',
    emoji: '⚽',
    description: 'Develop athletic and fitness skills',
    badges: [
      { name: 'Archery', url: 'https://www.scouting.org/merit-badges/archery/' },
      { name: 'Rifle Shooting', url: 'https://www.scouting.org/merit-badges/rifle-shooting/' },
      { name: 'Shotgun Shooting', url: 'https://www.scouting.org/merit-badges/shotgun-shooting/' },
      { name: 'Sports', url: 'https://www.scouting.org/merit-badges/sports/' },
      { name: 'Athletics', url: 'https://www.scouting.org/merit-badges/athletics/' },
      { name: 'Skating', url: 'https://www.scouting.org/merit-badges/skating/' },
      { name: 'Snow Sports', url: 'https://www.scouting.org/merit-badges/snow-sports/' },
      { name: 'Golf', url: 'https://www.scouting.org/merit-badges/golf/' },
      { name: 'Horsemanship', url: 'https://www.scouting.org/merit-badges/horsemanship/' },
      { name: 'Multisport', url: 'https://www.scouting.org/merit-badges/multisport/' },
      { name: 'Chess', url: 'https://www.scouting.org/merit-badges/chess/' }
    ]
  },
  {
    category: 'Technology & Innovation',
    emoji: '💻',
    description: 'Develop modern technology skills',
    badges: [
      { name: 'Programming', url: 'https://www.scouting.org/merit-badges/programming/' },
      { name: 'Coding', url: 'https://www.scouting.org/merit-badges/coding/' },
      { name: 'Robotics', url: 'https://www.scouting.org/merit-badges/robotics/' },
      { name: 'Artificial Intelligence', url: 'https://www.scouting.org/merit-badges/artificial-intelligence/' },
      { name: 'Digital Technology', url: 'https://www.scouting.org/merit-badges/digital-technology/' },
      { name: 'Electronics', url: 'https://www.scouting.org/merit-badges/electronics/' },
      { name: 'Radio', url: 'https://www.scouting.org/merit-badges/radio/' },
      { name: 'Cybersecurity', url: 'https://www.scouting.org/merit-badges/cybersecurity/' },
      { name: 'Game Design', url: 'https://www.scouting.org/merit-badges/game-design/' },
      { name: 'Inventing', url: 'https://www.scouting.org/merit-badges/inventing/' }
    ]
  },
  {
    category: 'Science & Nature',
    emoji: '🔬',
    description: 'Explore the natural world and sciences',
    badges: [
      { name: 'Animal Science', url: 'https://www.scouting.org/merit-badges/animal-science/' },
      { name: 'Astronomy', url: 'https://www.scouting.org/merit-badges/astronomy/' },
      { name: 'Bird Study', url: 'https://www.scouting.org/merit-badges/bird-study/' },
      { name: 'Botany', url: 'https://www.scouting.org/merit-badges/botany/' },
      { name: 'Chemistry', url: 'https://www.scouting.org/merit-badges/chemistry/' },
      { name: 'Geology', url: 'https://www.scouting.org/merit-badges/geology/' },
      { name: 'Insect Study', url: 'https://www.scouting.org/merit-badges/insect-study/' },
      { name: 'Mammal Study', url: 'https://www.scouting.org/merit-badges/mammal-study/' },
      { name: 'Microbiology', url: 'https://www.scouting.org/merit-badges/microbiology/' },
      { name: 'Nature', url: 'https://www.scouting.org/merit-badges/nature/' },
      { name: 'Oceanography', url: 'https://www.scouting.org/merit-badges/oceanography/' },
      { name: 'Plant Science', url: 'https://www.scouting.org/merit-badges/plant-science/' },
      { name: 'Reptile and Amphibian Study', url: 'https://www.scouting.org/merit-badges/reptile-and-amphibian-study/' },
      { name: 'Fish & Wildlife Management', url: 'https://www.scouting.org/merit-badges/fish-and-wildlife-management/' },
      { name: 'Weather', url: 'https://www.scouting.org/merit-badges/weather/' },
      { name: 'Forestry', url: 'https://www.scouting.org/merit-badges/forestry/' },
      { name: 'Gardening', url: 'https://www.scouting.org/merit-badges/gardening/' },
      { name: 'Sustainability', url: 'https://www.scouting.org/merit-badges/sustainability/' }
    ]
  },
  {
    category: 'Skilled Trades',
    emoji: '🔨',
    description: 'Build and create with hands-on skills',
    badges: [
      { name: 'Architecture', url: 'https://www.scouting.org/merit-badges/architecture/' },
      { name: 'Automotive Maintenance', url: 'https://www.scouting.org/merit-badges/automotive-maintenance/' },
      { name: 'Electricity', url: 'https://www.scouting.org/merit-badges/electricity/' },
      { name: 'Engineering', url: 'https://www.scouting.org/merit-badges/engineering/' },
      { name: 'Farm Mechanics', url: 'https://www.scouting.org/merit-badges/farm-mechanics/' },
      { name: 'Landscape Architecture', url: 'https://www.scouting.org/merit-badges/landscape-architecture/' },
      { name: 'Plumbing', url: 'https://www.scouting.org/merit-badges/plumbing/' },
      { name: 'Welding', url: 'https://www.scouting.org/merit-badges/welding/' },
      { name: 'Home Repairs', url: 'https://www.scouting.org/merit-badges/home-repairs/' },
      { name: 'Drafting', url: 'https://www.scouting.org/merit-badges/drafting/' }
    ]
  },
  {
    category: 'Arts & Crafts',
    emoji: '🎨',
    description: 'Express creativity and artistic talents',
    badges: [
      { name: 'Animation', url: 'https://www.scouting.org/merit-badges/animation/' },
      { name: 'Art', url: 'https://www.scouting.org/merit-badges/art/' },
      { name: 'Basketry', url: 'https://www.scouting.org/merit-badges/basketry/' },
      { name: 'Bugling', url: 'https://www.scouting.org/merit-badges/bugling/' },
      { name: 'Collections', url: 'https://www.scouting.org/merit-badges/collections/' },
      { name: 'Graphic Arts', url: 'https://www.scouting.org/merit-badges/graphic-arts/' },
      { name: 'Journalism', url: 'https://www.scouting.org/merit-badges/journalism/' },
      { name: 'Leatherwork', url: 'https://www.scouting.org/merit-badges/leatherwork/' },
      { name: 'Metalwork', url: 'https://www.scouting.org/merit-badges/metalwork/' },
      { name: 'Model Design and Building', url: 'https://www.scouting.org/merit-badges/model-design-and-building/' },
      { name: 'Moviemaking', url: 'https://www.scouting.org/merit-badges/moviemaking/' },
      { name: 'Music', url: 'https://www.scouting.org/merit-badges/music/' },
      { name: 'Painting', url: 'https://www.scouting.org/merit-badges/painting/' },
      { name: 'Photography', url: 'https://www.scouting.org/merit-badges/photography/' },
      { name: 'Pottery', url: 'https://www.scouting.org/merit-badges/pottery/' },
      { name: 'Reading', url: 'https://www.scouting.org/merit-badges/reading/' },
      { name: 'Sculpture', url: 'https://www.scouting.org/merit-badges/sculpture/' },
      { name: 'Textile', url: 'https://www.scouting.org/merit-badges/textile-and-fiber-arts/' },
      { name: 'Theater', url: 'https://www.scouting.org/merit-badges/theater/' },
      { name: 'Wood Carving', url: 'https://www.scouting.org/merit-badges/woodcarving/' }
    ]
  },
  {
    category: 'Hobbies & Collections',
    emoji: '⭐',
    description: 'Explore your interests and passions',
    badges: [
      { name: 'Archaeology', url: 'https://www.scouting.org/merit-badges/archaeology/' },
      { name: 'Coin Collecting', url: 'https://www.scouting.org/merit-badges/coin-collecting/' },
      { name: 'Dog Care', url: 'https://www.scouting.org/merit-badges/dog-care/' },
      { name: 'Fingerprinting', url: 'https://www.scouting.org/merit-badges/fingerprinting/' },
      { name: 'Genealogy', url: 'https://www.scouting.org/merit-badges/genealogy/' },
      { name: 'Pets', url: 'https://www.scouting.org/merit-badges/pets/' },
      { name: 'Pulp and Paper', url: 'https://www.scouting.org/merit-badges/pulp-and-paper/' },
      { name: 'Stamp Collecting', url: 'https://www.scouting.org/merit-badges/stamp-collecting/' }
    ]
  },
  {
    category: 'Citizenship & Community',
    emoji: '🤝',
    description: 'Make a positive difference in the world',
    badges: [
      { name: 'American Heritage', url: 'https://www.scouting.org/merit-badges/american-heritage/' },
      { name: 'American Cultures', url: 'https://www.scouting.org/merit-badges/american-cultures/' },
      { name: 'American Indian Culture', url: 'https://www.scouting.org/merit-badges/american-indian-culture/' },
      { name: 'American Business', url: 'https://www.scouting.org/merit-badges/american-business/' },
      { name: 'American Labor', url: 'https://www.scouting.org/merit-badges/american-labor/' },
      { name: 'Crime Prevention', url: 'https://www.scouting.org/merit-badges/crime-prevention/' },
      { name: 'Disabilities Awareness', url: 'https://www.scouting.org/merit-badges/disabilities-awareness/' },
      { name: 'Family Life', url: 'https://www.scouting.org/merit-badges/family-life/' },
      { name: 'Public Speaking', url: 'https://www.scouting.org/merit-badges/public-speaking/' },
      { name: 'Safety', url: 'https://www.scouting.org/merit-badges/safety/' }
    ]
  },
  {
    category: 'Career Pathways',
    emoji: '💼',
    description: 'Explore professional opportunities',
    badges: [
      { name: 'Aviation', url: 'https://www.scouting.org/merit-badges/aviation/' },
      { name: 'Business', url: 'https://www.scouting.org/merit-badges/business/' },
      { name: 'Dentistry', url: 'https://www.scouting.org/merit-badges/dentistry/' },
      { name: 'Entrepreneurship', url: 'https://www.scouting.org/merit-badges/entrepreneurship/' },
      { name: 'Exploration', url: 'https://www.scouting.org/merit-badges/exploration/' },
      { name: 'Health Care Professions', url: 'https://www.scouting.org/merit-badges/health-care-professions/' },
      { name: 'Law', url: 'https://www.scouting.org/merit-badges/law/' },
      { name: 'Mining in Society', url: 'https://www.scouting.org/merit-badges/mining-in-society/' },
      { name: 'Personal Management', url: 'https://www.scouting.org/merit-badges/personal-management/' },
      { name: 'Public Health', url: 'https://www.scouting.org/merit-badges/public-health/' },
      { name: 'Railroading', url: 'https://www.scouting.org/merit-badges/railroading/' },
      { name: 'Salesmanship', url: 'https://www.scouting.org/merit-badges/salesmanship/' },
      { name: 'Scholarship', url: 'https://www.scouting.org/merit-badges/scholarship/' },
      { name: 'Scouting Heritage', url: 'https://www.scouting.org/merit-badges/scouting-heritage/' },
      { name: 'Surveying', url: 'https://www.scouting.org/merit-badges/surveying/' },
      { name: 'Traffic Safety', url: 'https://www.scouting.org/merit-badges/traffic-safety/' },
      { name: 'Truck Transportation', url: 'https://www.scouting.org/merit-badges/truck-transportation/' },
      { name: 'Veterinary Medicine', url: 'https://www.scouting.org/merit-badges/veterinary-medicine/' }
    ]
  }
];

const BEGINNER_BADGES = ['Cooking', 'Camping', 'First Aid', 'Pets', 'Collections', 'Photography', 'Fingerprinting', 'Communication', 'Chess', 'Reading'];

// Color constants for PDF button styling
const PDF_BUTTON_COLORS = {
  bgDefault: 'rgba(200, 150, 80, 0.25)',
  bgHover: 'rgba(200, 150, 80, 0.4)',
  borderDefault: 'rgba(200, 150, 80, 0.4)',
  borderHover: 'rgba(200, 150, 80, 0.7)'
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

/**
 * Merit Badges Page
 * ⚡ OPTIMIZATION:
 * 1. Static object hoisting: Framer Motion variants defined outside component to avoid recreation.
 * 2. useMemo for filteredCategories: Prevents expensive O(N*M) recalculation of ~150 badges
 *    when toggling unrelated state like selectedCategory (expansion).
 * 3. Search optimization: Lowercase search term once outside the filter loop.
 */
export default function Badges() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === '') return BADGE_CATEGORIES;

    return BADGE_CATEGORIES
      .map(cat => ({
        ...cat,
        badges: cat.badges.filter(badge =>
          badge.name.toLowerCase().includes(term)
        )
      }))
      .filter(cat =>
        cat.category.toLowerCase().includes(term) ||
        cat.badges.length > 0
      );
  }, [searchTerm]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-v2 section" style={{ minHeight: '55vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 24 }}>Merit Badges</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 700, margin: '0 auto' }}>
              Explore over 140 merit badges across 8 categories. Each badge represents mastery of a skill, knowledge, or service to your community. Earn badges to progress toward Eagle Scout!
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE MERIT BADGE PROCESS */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <div className="glass-card" style={{ padding: 40 }}>
              <h2 style={{ marginBottom: 32 }}>The Merit Badge Process</h2>

              <ol style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                <li style={{ marginBottom: 16 }}>
                  The Scout develops an interest in a merit badge and may begin working on the requirements.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout and unit leader discuss the Scout's interest in the merit badge.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The unit leader signs a blue card or otherwise documents the conversation and provides the Scout with at least one counselor contact.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout contacts the counselor.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The counselor considers any work toward requirements completed prior to the initial discussion with the unit leader.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout and the counselor meet, as many times as necessary. The counselor reviews work, to verify that the Scout has actually and personally completed each requirement exactly as written. For merit badge counselor meetings only, the Scout, parent or guardian, and counselor can meet. In a group setting with two or more Scouts, there must be at least two registered leaders present, in accordance with the Guide to Safe Scouting.
                </li>
                <li style={{ marginBottom: 16 }}>
                  Partial progress is recorded as requirements are completed.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout finishes the requirements.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The counselor approves completion and signs the blue card or other documentation.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The Scout gives the blue card or other evidence of completion to the unit leader. The unit leader signs the applicant record section of the blue card or otherwise documents completion of the merit badge.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The unit leader gives the Scout the applicant record portion of the blue card or other hard copy record that the Scout may retain.
                </li>
                <li style={{ marginBottom: 16 }}>
                  The unit reports completion of the merit badge.
                </li>
                <li>
                  The Scout receives the merit badge.
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: 600, margin: '0 auto' }}
          >
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: 19, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search categories..."
                aria-label="Search merit badge categories"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedCategory(null);
                }}
                className="search-input"
                style={{ paddingLeft: 44, width: '100%' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="section section--dark">
        <div className="container">
          {filteredCategories.length > 0 ? (
            <motion.div
              className="grid grid--cols-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              style={{ gap: 24 }}
            >
              {filteredCategories.map((catItem, i) => (
                <motion.div
                  key={`category-${catItem.category}`}
                  variants={itemVariants}
                  className="glass-card"
                  style={{ padding: 28, cursor: 'pointer', transition: 'all 0.3s ease' }}
                  whileHover={{ scale: 1.02, borderColor: 'var(--accent-border)' }}
                  onClick={() => setSelectedCategory(selectedCategory === i ? null : i)}
                >
                  {/* Category Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: '3rem' }}>{catItem.emoji}</div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{catItem.category}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{catItem.badges.length} badges</p>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 16 }}>
                    {catItem.description}
                  </p>

                  {/* Badges Grid */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: selectedCategory === i ? 1 : 0, height: selectedCategory === i ? 'auto' : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, paddingTop: 16, borderTop: '1px solid var(--divider)' }}>
                      {catItem.badges.map((badge) => {
                        const cleanBadgeName = badge.name.replace(/^[✓⭐\s]+/, '').trim();
                        const isBeginnerBadge = BEGINNER_BADGES.includes(cleanBadgeName);
                        const pdfUrl = BADGE_PDF_URLS[cleanBadgeName];

                        if (badge.isHeader) {
                          return (
                            <div
                              key={`badge-${badge.name}`}
                              style={{
                                gridColumn: '1 / -1',
                                padding: '12px 0',
                                marginTop: '8px',
                                textAlign: 'center',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                color: '#10b981',
                                borderTop: '2px solid #10b981',
                                borderBottom: '2px solid #10b981'
                              }}
                            >
                              {badge.name}
                            </div>
                          );
                        }

                        return (
                          <motion.div key={`badge-${badge.name}`} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <motion.div
                              style={{
                                display: 'flex',
                                gap: 4
                              }}
                            >
                              <motion.a
                                href={badge.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  flex: 1,
                                  padding: '8px 12px',
                                  background: 'var(--accent-dim)',
                                  borderRadius: pdfUrl ? '8px 0 0 8px' : '8px',
                                  fontSize: '0.85rem',
                                  textAlign: 'center',
                                  border: '1px solid var(--accent-dim)',
                                  textDecoration: 'none',
                                  color: 'var(--text-primary)',
                                  transition: 'all 0.3s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 4
                                }}
                                whileHover={{
                                  background: 'var(--accent-dim)',
                                  borderColor: 'var(--accent)',
                                  scale: 1.05
                                }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {badge.name}
                              </motion.a>
                              {pdfUrl && (
                                <motion.a
                                  href={pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    padding: '8px 10px',
                                    background: PDF_BUTTON_COLORS.bgDefault,
                                    borderRadius: '0 8px 8px 0',
                                    border: `1px solid ${PDF_BUTTON_COLORS.borderDefault}`,
                                    textDecoration: 'none',
                                    color: 'var(--text-muted)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: 40
                                  }}
                                  whileHover={{
                                    background: PDF_BUTTON_COLORS.bgHover,
                                    borderColor: PDF_BUTTON_COLORS.borderHover,
                                    scale: 1.05
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Download PDF pamphlet"
                                >
                                  <ExternalLink size={14} />
                                </motion.a>
                              )}
                            </motion.div>
                            {isBeginnerBadge && (
                              <div style={{
                                position: 'absolute',
                                top: -8,
                                right: 20,
                                background: '#10b981',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}>
                                Beginner
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Expand Button */}
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <motion.div
                      animate={{ rotate: selectedCategory === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'inline-block' }}
                    >
                      <ArrowRight size={18} style={{ color: 'var(--accent)' }} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No badges found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </section>

      {/* BADGE INFO SECTION */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ maxWidth: 900, margin: '0 auto' }}
          >
            <div className="glass-card" style={{ padding: 40 }}>
              <h2 style={{ marginBottom: 24 }}>About Merit Badges</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: 12, color: 'var(--accent)' }}>140+ Badges</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Choose from a wide variety of merit badges covering skills, hobbies, and interests.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: 12, color: 'var(--accent)' }}>Rank Progress</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Earn required badges to advance ranks and work toward the prestigious Eagle Scout rank.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: 12, color: 'var(--accent)' }}>Skill Development</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Master new skills, explore careers, and discover lifelong passions through badge work.
                  </p>
                </div>
              </div>

              <motion.a
                href="https://www.scouting.org/skills/merit-badges/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ marginTop: 32, width: '100%', display: 'block', textAlign: 'center' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Merit Badges on Scouting.org
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OFFICIAL SCOUTS BSA REQUIREMENTS PDF */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="glass-card"
            style={{
              padding: 32,
              background: 'linear-gradient(135deg, var(--accent-dim) 0%, rgba(0, 214, 143, 0.05) 100%)',
              border: '2px solid var(--accent-border)',
              textAlign: 'center'
            }}
          >
            <h3 style={{ color: 'var(--accent)', marginBottom: 16 }}>📋 Official Scouts BSA Requirements</h3>
            <p style={{ color: 'var(--text-primary)', marginBottom: 20 }}>
              Download the complete official Scouts BSA Requirements document from Scouting America:
            </p>
            <motion.a
              href="https://www.scouting.org/wp-content/uploads/2026/02/3321625-Scouts-BSA-Requirements.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <ExternalLink size={18} /> Download PDF (Scouts BSA Requirements)
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
