import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search } from 'lucide-react';

const GLOSSARY_TERMS = [
  { term: 'Advancement', def: 'The process of earning rank badges and merit badges in Scouting. Each rank has specific requirements you must complete.' },
  { term: 'Arrow of Light', def: 'The highest rank in Cub Scouts (before Boy Scouts). Many Scouts join Troop 242 after earning this award.' },
  { term: 'Assistant Scoutmaster (ASM)', def: 'Adult leaders who help the Scoutmaster run the troop and mentor Scouts at events and meetings.' },
  { term: 'Blue Card', def: 'The official BSA form used to track your progress on a merit badge. Your Scoutmaster signs it when you start; the counselor signs when you finish.' },
  { term: 'Board of Review', def: 'A friendly meeting with troop committee members (not your leaders) where you discuss your scouting experiences before receiving a rank badge.' },
  { term: 'BSA', def: 'Boy Scouts of America — the national organization that runs Scouting. They set the rules, ranks, and merit badge requirements.' },
  { term: 'Campout', def: 'An overnight trip where Scouts practice outdoor skills, cook meals, hike, and have fun in nature. Usually one per month.' },
  { term: 'Charter Organization', def: 'The organization (often a church, school, or civic group) that sponsors your troop. They provide meeting space and community support.' },
  { term: 'Committee', def: 'The group of adult volunteers (usually parents) who handle the business side of the troop: finances, events, advancement records.' },
  { term: 'Court of Honor', def: 'A special ceremony where Scouts receive their rank patches, merit badges, and awards in front of their families. Held a few times a year.' },
  { term: 'Den', def: 'A small group in Cub Scouts (younger kids). In Boy Scouts, the equivalent group is called a Patrol.' },
  { term: 'Eagle Project', def: 'A significant community service project planned and led by a Life Scout to qualify for Eagle Scout rank. Must benefit a non-profit organization.' },
  { term: 'Eagle Scout', def: 'The highest rank in Scouting, requiring 21 merit badges (including 13 specific ones), leadership roles, and a community service project. Only about 4% of Scouts earn it.' },
  { term: 'First Aid', def: 'Emergency medical care given before professional help arrives. Scouts learn CPR, treating cuts, burns, and other injuries.' },
  { term: 'Flag Ceremony', def: 'A formal ritual for raising, lowering, and folding the American flag. Scouts participate in these at meetings and events.' },
  { term: 'Fleur-de-lis', def: 'The three-pointed symbol (⚜️) used in Scouting worldwide. You see it on the BSA logo and Troop 242\'s emblem.' },
  { term: 'Green Bar', def: 'The troop\'s youth leadership team: Senior Patrol Leader, Patrol Leaders, and other Scout leaders.' },
  { term: 'Guide to Safe Scouting', def: 'BSA\'s official rulebook for keeping Scouts safe. Covers everything from camp safety to online conduct.' },
  { term: 'High Adventure', def: 'Challenging outdoor programs like backpacking, rock climbing, whitewater rafting, or sailing — usually for older, more experienced Scouts.' },
  { term: 'Jamboree', def: 'A large gathering of thousands of Scouts from across the country (or world). BSA holds a National Jamboree every 4 years.' },
  { term: 'Leave No Trace (LNT)', def: 'A set of outdoor ethics to minimize your impact on nature. Pack out your trash, stay on trails, and respect wildlife.' },
  { term: 'Merit Badge', def: 'A cloth badge earned by completing specific requirements in a skill area (cooking, programming, astronomy, etc.). There are 158 merit badges total.' },
  { term: 'Merit Badge Counselor', def: 'An adult who is an expert in a particular subject and is registered to teach and sign off on that merit badge.' },
  { term: 'Neckerchief', def: 'The triangular cloth worn around the neck as part of the Scout uniform. Troop 242 has its own distinctive neckerchief.' },
  { term: 'Order of the Arrow (OA)', def: 'Scouting\'s honor camping society. Life Scouts and above can be nominated by their troop for membership based on camping experience and Scout spirit.' },
  { term: 'Patrol', def: 'A small group of 6–8 Scouts within the troop. Each patrol has its own name, yell, and elected Patrol Leader.' },
  { term: 'Patrol Leader', def: 'A Scout elected by their patrol to lead it. One of the first leadership positions a Scout can hold.' },
  { term: 'Patrol Leader Council (PLC)', def: 'A meeting of all patrol leaders and troop leaders where they plan the troop\'s program and events.' },
  { term: 'Philmont', def: 'Philmont Scout Ranch in New Mexico — BSA\'s flagship high-adventure camp with 200+ miles of wilderness trails.' },
  { term: 'Rank', def: 'One of seven levels in Scouting: Scout, Tenderfoot, Second Class, First Class, Star, Life, and Eagle Scout.' },
  { term: 'Scout Oath', def: 'The promise every Scout makes: "On my honor, I will do my best to do my duty to God and my country, to obey the Scout Law, to help other people at all times, to keep myself physically strong, mentally awake, and morally straight."' },
  { term: 'Scout Law', def: 'Twelve values every Scout lives by: Trustworthy, Loyal, Helpful, Friendly, Courteous, Kind, Obedient, Cheerful, Thrifty, Brave, Clean, and Reverent.' },
  { term: 'Scout Motto', def: '"Be Prepared" — always ready physically, mentally, and morally for whatever comes.' },
  { term: 'Scout Slogan', def: '"Do a Good Turn Daily" — find one way to help someone every single day.' },
  { term: 'Scoutmaster', def: 'The primary adult leader of the troop, responsible for the program and the Scouts\' development. Troop 242\'s Scoutmaster is Rich Lester.' },
  { term: 'Senior Patrol Leader (SPL)', def: 'The top youth leader of the troop, elected by all Scouts. They run meetings and lead the Patrol Leader Council.' },
  { term: 'Service Project', def: 'Volunteer work done to benefit the community. Scouts complete service hours as requirements for multiple ranks.' },
  { term: 'Summer Camp', def: 'A week-long resident camp where Scouts earn multiple merit badges, develop skills, and have adventures with their troop.' },
  { term: 'Totin\' Chip', def: 'A certification card that shows a Scout has learned the proper and safe use of knives, axes, and saws. Required before handling these tools at camp.' },
  { term: 'Troop', def: 'Your main Scouting unit — Troop 242! Made up of multiple patrols, led by a Scoutmaster, and chartered to a local organization.' },
  { term: 'Two-Deep Leadership', def: 'BSA\'s safety rule that at least two registered adult leaders (or one adult plus a parent) must be present at all Scout activities.' },
  { term: 'Uniform', def: 'The official Scout shirt, pants, belt, and neckerchief worn at meetings and events. Shows pride and unity in the troop.' },
  { term: 'Unit', def: 'A generic term for any Scouting group: a Troop (Boy Scouts), Pack (Cub Scouts), or Crew (Venturing).' },
  { term: 'Webelos', def: 'The oldest level of Cub Scouts (usually 4th–5th grade), just before crossing over to a Boy Scout Troop.' },
  { term: 'Wood Badge', def: 'An advanced leadership training course for adult Scout leaders, symbolized by wooden beads on a leather thong.' },
  { term: 'Youth Protection Training (YPT)', def: 'Mandatory online training all adult leaders must complete before working with Scouts. Teaches how to recognize and prevent abuse.' },
];

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = GLOSSARY_TERMS.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.def.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const letters = [...new Set(filtered.map(item => item.term[0].toUpperCase()))].sort();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* HERO */}
      <section className="hero-v2 section" style={{ minHeight: '45vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ marginBottom: 16 }}>Scout Glossary</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 650, margin: '0 auto' }}>
              New to Scouting? Here is every term you need to know — explained in plain language.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="section section--dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: 500, margin: '0 auto' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: 12,
              padding: '12px 16px'
            }}>
              <Search size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  fontFamily: 'var(--font-body)'
                }}
              />
              {searchTerm && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TERMS */}
      <section className="section section--dark">
        <div className="container" style={{ maxWidth: 900 }}>
          {filtered.length === 0 ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: 40 }}>
              No terms found for "{searchTerm}".
            </motion.p>
          ) : (
            letters.map(letter => (
              <motion.div
                key={letter}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                style={{ marginBottom: 48 }}
              >
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--accent)',
                  marginBottom: 16,
                  paddingBottom: 8,
                  borderBottom: '2px solid var(--accent-dim)'
                }}>
                  {letter}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filtered
                    .filter(item => item.term[0].toUpperCase() === letter)
                    .map((item, i) => (
                      <motion.div key={i} variants={itemVariants} className="glass-card" style={{ padding: '20px 24px' }}>
                        <h4 style={{ color: 'var(--accent)', marginBottom: 8, fontSize: '1rem' }}>{item.term}</h4>
                        <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.7, fontSize: '0.95rem' }}>{item.def}</p>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
