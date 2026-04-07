-- Seed data: ~20 humanity's greatest moments

insert into entries (year, title, subtitle, summary, body, image_url, category, status, likes_count) values

(1969, 'First humans walk on the Moon', 'Apollo 11, July 20, 1969',
 'Neil Armstrong and Buzz Aldrin become the first humans to set foot on another world, fulfilling a decade-long national mission and inspiring a generation.',
 'On July 20, 1969, the Apollo 11 lunar module Eagle touched down in the Sea of Tranquility. Neil Armstrong''s descent down the ladder and his first step onto the lunar surface was watched by an estimated 600 million people — roughly one-fifth of all humanity at the time. "That''s one small step for man, one giant leap for mankind." The mission returned 21.5 kg of lunar samples and proved that humans could leave Earth and return safely.',
 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1600',
 'science', 'published', 12400),

(1928, 'Penicillin discovered by Alexander Fleming', 'The accident that saved 200 million lives',
 'A contaminated petri dish leads to the discovery of the world''s first antibiotic, forever changing medicine and saving hundreds of millions of lives across the 20th century.',
 'In September 1928, Alexander Fleming returned from vacation to find mold growing on a staphylococcus culture plate. Instead of discarding it, he noticed the mold had created a bacteria-free zone — the mold, Penicillium notatum, was secreting something that killed bacteria. Fleming published his findings, and a decade later, Howard Florey and Ernst Chain developed the drug into the antibiotic we know today. The discovery transformed medicine: infections that were once death sentences became treatable.',
 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1600',
 'medicine', 'published', 9800),

(1989, 'The World Wide Web is invented', 'Tim Berners-Lee''s proposal changes everything',
 'A British scientist at CERN writes a proposal for an information management system that becomes the foundation of the modern internet, connecting humanity like never before.',
 'In March 1989, Tim Berners-Lee submitted a proposal to his supervisor at CERN titled "Information Management: A Proposal." His boss wrote "vague but exciting" on the cover. By 1991, the first website was live. Berners-Lee''s decision to release the web''s underlying protocols royalty-free meant anyone could build on it — a choice that seeded one of the greatest expansions of human knowledge and communication in history.',
 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600',
 'science', 'published', 8900),

(2003, 'Human Genome Project completed', 'All 3 billion base pairs mapped',
 'An international consortium of scientists completes the sequencing of the entire human genome, opening a new era of personalized medicine and genetic research.',
 'The Human Genome Project, launched in 1990, was completed in April 2003. It identified approximately 20,500 human genes and sequenced all 3 billion base pairs of human DNA. The project involved researchers from the US, UK, France, Germany, Japan, and China. Its data has enabled the development of thousands of genetic tests, fueled research into cancer, rare diseases, and drug development, and formed the backbone of modern genomics.',
 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1600',
 'medicine', 'published', 7200),

(1879, 'Thomas Edison demonstrates the light bulb', 'Darkness retreats from human civilization',
 'After testing thousands of materials, Edison successfully demonstrates a long-lasting incandescent light bulb, launching the era of electric light and transforming daily life forever.',
 'On October 22, 1879, after experimenting with over 6,000 different materials for a filament, Thomas Edison demonstrated a light bulb that burned for 13.5 hours. Within a year, he had improved it to last over 1,200 hours. Electric light extended the productive hours of the day, made cities safer, transformed how people read, worked, and gathered, and paved the way for the electrification of the modern world.',
 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1600',
 'science', 'published', 6800),

(2015, 'Gravitational waves detected for the first time', 'Einstein''s century-old prediction confirmed',
 'LIGO detects ripples in spacetime from two colliding black holes 1.3 billion light-years away, opening a new window into the universe and confirming general relativity.',
 'On September 14, 2015, the Laser Interferometer Gravitational-Wave Observatory detected a signal lasting 0.2 seconds. It was the sound of two black holes — each roughly 30 times the mass of the sun — merging over a billion years ago. The observation confirmed the last unverified prediction of Einstein''s general relativity and opened an entirely new form of astronomy: listening to the universe rather than just watching it.',
 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600',
 'science', 'published', 7600),

(1955, 'Polio vaccine declared safe and effective', 'One of medicine''s greatest triumphs',
 'Dr. Jonas Salk''s polio vaccine is declared safe and effective following the largest clinical trial in history, bringing hope to a world gripped by fear of a paralyzing disease.',
 'For years, polio paralyzed tens of thousands of children annually. Parents kept kids indoors during summer "polio season." On April 12, 1955, a nationwide announcement confirmed that Jonas Salk''s vaccine was "safe, effective, and potent." Church bells rang, factories closed early, and people wept with relief. By 1979, polio was eradicated in the United States. Today, thanks to global vaccination campaigns, polio is on the brink of worldwide elimination.',
 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600',
 'medicine', 'published', 8100),

(1804, 'Beethoven premieres his Third Symphony', 'Music that rewrote the rules of composition',
 'Ludwig van Beethoven''s "Eroica" symphony premieres in Vienna, breaking all conventions of the time and expanding what music could express — a turning point in Western art.',
 'The Eroica — Symphony No. 3 in E-flat major — was unlike anything audiences had heard. It was nearly three times longer than typical symphonies of the era. Its emotional range — from the grandeur of the first movement to the profound Funeral March — was unprecedented. Originally dedicated to Napoleon (until he declared himself Emperor), it marked the beginning of the Romantic era in classical music and expanded humanity''s understanding of what art could achieve.',
 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1600',
 'art', 'published', 5200),

(1948, 'Universal Declaration of Human Rights adopted', '30 articles that define our shared humanity',
 'The United Nations adopts the Universal Declaration of Human Rights, the first global statement affirming that all human beings are born free and equal in dignity and rights.',
 'Drafted in the aftermath of World War II, the UDHR was adopted by the UN General Assembly on December 10, 1948. Authored by a committee chaired by Eleanor Roosevelt, it established for the first time that human rights are universal — belonging to every person on Earth regardless of nationality, race, sex, or religion. It has since been translated into over 500 languages and forms the basis of international human rights law.',
 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600',
 'humanitarian', 'published', 6700),

(1903, 'First successful powered airplane flight', 'Twelve seconds that changed the world',
 'Orville and Wilbur Wright achieve the first sustained, controlled, powered heavier-than-air flight at Kitty Hawk, North Carolina, opening the age of aviation.',
 'On December 17, 1903, Orville Wright piloted the Flyer for 12 seconds, covering 120 feet. Four flights were made that day. Just 66 years later, humans walked on the Moon. The Wright brothers — bicycle mechanics with no university degrees — solved the problem of controlled powered flight that had eluded humanity for centuries. Their success triggered one of the fastest transformations of transportation in history.',
 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600',
 'science', 'published', 7100),

(2010, 'Global child mortality falls below 7 million', 'An invisible miracle of modern development',
 'For the first time in recorded history, fewer than 7 million children under age five died in a single year — a 50% reduction since 1990 driven by vaccines, nutrition, and healthcare.',
 'In 1990, nearly 13 million children under five died each year. By 2010, that number had fallen below 7 million — a reduction of over 45% in just two decades. The decline was driven by expanded access to vaccines, oral rehydration therapy for diarrhea, vitamin A supplementation, better nutrition, and improved maternal care. UNICEF called it one of the greatest achievements in human development. The trend has continued: by 2022, the number was below 5 million.',
 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600',
 'humanitarian', 'published', 8300),

(1962, 'Rachel Carson publishes Silent Spring', 'The book that launched environmentalism',
 'Marine biologist Rachel Carson publishes a meticulous indictment of pesticide use, igniting the modern environmental movement and leading to the ban of DDT and the creation of the EPA.',
 '"Silent Spring" documented how pesticides, especially DDT, were harming bird populations and entering the food chain. Despite fierce opposition from the chemical industry, Carson''s rigorous science prevailed. President Kennedy ordered a review of pesticide policy. Within a decade, DDT was banned in the US, the Environmental Protection Agency was created, and environmental consciousness entered mainstream culture. Carson showed that individuals can challenge industries and win.',
 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600',
 'environment', 'published', 6200),

(1990, 'Hubble Space Telescope launched', 'Eyes that see the universe''s first light',
 'NASA launches the Hubble Space Telescope, which — despite an early flaw — goes on to produce transformative images of the cosmos and reshape our understanding of the universe.',
 'Launched on April 24, 1990, Hubble initially had a flawed mirror. But a 1993 servicing mission corrected it, and the telescope began producing images of breathtaking clarity. Hubble has observed objects 13.4 billion light-years away, helped determine the age of the universe (approximately 13.8 billion years), provided evidence for dark energy, and revealed that nearly every large galaxy harbors a supermassive black hole at its center.',
 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600',
 'science', 'published', 7800),

(1994, 'Nelson Mandela elected President of South Africa', 'The long walk to freedom concludes',
 'After 27 years in prison, Nelson Mandela is elected President of South Africa in the nation''s first fully democratic election, marking the peaceful end of apartheid.',
 'On May 10, 1994, Nelson Mandela was inaugurated as South Africa''s first Black president. The election was the culmination of decades of struggle against apartheid — a system of institutionalized racial segregation. Mandela chose reconciliation over retribution, establishing the Truth and Reconciliation Commission and becoming a global symbol of forgiveness and moral leadership. His presidency showed the world that even the deepest injustices can be peacefully dismantled.',
 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600',
 'humanitarian', 'published', 9100),

(2020, 'COVID-19 vaccine developed in record time', 'Science''s fastest ever response to a pandemic',
 'Multiple safe and effective COVID-19 vaccines are developed in under a year — a feat previously thought impossible — using breakthrough mRNA technology that will reshape medicine.',
 'Traditional vaccine development takes 10–15 years. The COVID-19 vaccines were developed, tested in massive trials, and authorized for emergency use within 11 months of the virus''s genetic sequence being published. The Pfizer-BioNTech and Moderna mRNA vaccines were the first mRNA vaccines ever approved for humans. Beyond COVID, the technology is now being applied to cancer, HIV, and other diseases. It represents one of the most significant advances in medical technology of the 21st century.',
 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600',
 'medicine', 'published', 8500),

(1985, 'Live Aid concert raises $127 million for famine relief', 'The day music fed the world',
 'Bob Geldof organizes a global concert broadcast to 1.9 billion viewers across 150 countries, raising an unprecedented sum for famine victims in Ethiopia.',
 'On July 13, 1985, simultaneous concerts in London and Philadelphia were watched by an estimated 1.9 billion people. Queen''s performance at Wembley Stadium is frequently cited as one of the greatest live performances in rock history. The event raised over $127 million (equivalent to about $360 million today) for Ethiopian famine relief. Live Aid demonstrated the power of popular culture as a force for humanitarian action and inspired a generation of benefit events.',
 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600',
 'humanitarian', 'published', 5900),

(2016, 'Solar energy becomes the cheapest electricity in history', 'The renewable revolution arrives',
 'For the first time ever, solar power bids come in cheaper than fossil fuels in multiple countries, marking a turning point in the global transition to clean energy.',
 'In 2016, solar auction prices in Chile, UAE, and India fell to record lows — below $0.03 per kilowatt-hour, cheaper than coal or gas. The cost of solar panels had fallen 99% since 1977. Bloomberg New Energy Finance declared it "the beginning of the end" for fossil fuel dominance. Since then, renewable energy has continued to break price records annually, and solar is now the cheapest source of electricity in history, accelerating the transition away from carbon-intensive power.',
 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600',
 'environment', 'published', 7400),

(776, 'First Olympic Games held in ancient Greece', 'A festival of peace and human excellence',
 'The ancient Greeks establish the Olympic Games at Olympia, creating a tradition of peaceful athletic competition and cultural exchange that endures — in evolved form — to this day.',
 'The first recorded Olympic Games took place in 776 BC at Olympia in the Peloponnese. Initially just a single footrace, the games grew to include chariot racing, wrestling, the pentathlon, and more. A sacred truce — the Ekecheiria — paused wars so athletes and spectators could travel safely. The Olympics embodied Greek ideals of arete (excellence) and the harmony of mind and body. After a 1,500-year gap, they were revived in Athens in 1896 and continue today.',
 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=1600',
 'art', 'published', 4800),

(1961, 'Yuri Gagarin becomes first human in space', 'Humanity reaches beyond its cradle',
 'Soviet cosmonaut Yuri Gagarin completes a 108-minute orbit of the Earth aboard Vostok 1, becoming the first human being to travel into space and see our planet from above.',
 'On April 12, 1961, Yuri Gagarin launched from Baikonur Cosmodrome and orbited Earth once at an altitude of 327 km. When asked to describe what he saw, he said Earth was "surrounded by a light blue halo that gradually darkened and turned into black." His flight lasted 108 minutes. The mission demonstrated that human spaceflight was possible and triggered the Space Race that would culminate in the Moon landing eight years later.',
 'https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=1600',
 'science', 'published', 8700),

(2012, 'Higgs boson particle confirmed at CERN', 'The last piece of the Standard Model puzzle',
 'Scientists at CERN''s Large Hadron Collider announce the discovery of a new particle consistent with the Higgs boson, completing the Standard Model of particle physics after a 50-year search.',
 'On July 4, 2012, physicists at CERN announced the discovery of a particle matching the properties of the Higgs boson — the particle responsible for giving mass to other particles. Predicted by Peter Higgs in 1964, the particle had eluded detection for nearly five decades. Its confirmation completed the Standard Model and validated one of the most successful scientific frameworks ever developed. Peter Higgs and François Englert were awarded the Nobel Prize in Physics in 2013.',
 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1600',
 'science', 'published', 6900);
