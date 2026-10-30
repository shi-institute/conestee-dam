<script lang="ts">
	import { StoryHeading, Timeline } from '$lib/components';
	import { fetchGlossary, linkGlossaryTerms } from '$lib/glossary';
	import { stories } from '$lib/stories';
	import type { Attachment } from 'svelte/attachments';

	import photo18901915TextileMillsBuilt from '../story/pollution/timeline-photos/1890-1915-textile-mills-built.webp?enhanced&w=112&aspect=1';
	import photo1923ConditionsAtTheirWorst from '../story/pollution/timeline-photos/1923-conditions-at-their-worst.webp?enhanced&w=112&aspect=1';
	import photo1925ConesteeSues from '../story/pollution/timeline-photos/1925-conestee-sues.webp?enhanced&w=112&aspect=1';
	import photo1931Settlement from '../story/pollution/timeline-photos/1931-settlement.webp?enhanced&w=112&aspect=1';
	import photo1999FoundationChartered from '../story/pollution/timeline-photos/1999-foundation-chartered.webp?enhanced&w=112&aspect=1';
	import photo2000FoundationAcquires from '../story/pollution/timeline-photos/2000-foundation-acquires.webp?enhanced&w=112&aspect=1';
	import photo2025NewDamCompleted from '../story/pollution/timeline-photos/2025-new-dam-completed.webp?enhanced&w=112&aspect=1';
	import photo2027TakeOwnership from '../story/pollution/timeline-photos/2027-take-ownership.webp?enhanced&w=112&aspect=1';
	import photo1831TimberDam from '../story/sediment/timeline-photos/1831-timber-dam.webp?enhanced&w=112&aspect=1';
	import photo1885WoodenDam from '../story/sediment/timeline-photos/1885-wooden-dam.webp?enhanced&w=112&aspect=1';
	import photo1892StoneDamCompleted from '../story/sediment/timeline-photos/1892-stone-dam-completed.webp?enhanced&w=112&aspect=1';
	import photo1908RecordFlood from '../story/sediment/timeline-photos/1908-record-flood.webp?enhanced&w=112&aspect=1';
	import photo1943ArmyBaseBuilt from '../story/sediment/timeline-photos/1943-army-base-built.webp?enhanced&w=112&aspect=1';
	import photo1950s1960sFirstLandfill from '../story/sediment/timeline-photos/1950s-1960s-first-landfill.webp?enhanced&w=112&aspect=1';
	import photo1960s1970sSecondLandfill from '../story/sediment/timeline-photos/1960s-1970s-second-landfill.webp?enhanced&w=112&aspect=1';
	import photo20002001ConesteeCanyon from '../story/sediment/timeline-photos/2000-2001-conestee-canyon.webp?enhanced&w=112&aspect=1';
	import photo20002003Sampling from '../story/sediment/timeline-photos/2000-2003-sampling.webp?enhanced&w=112&aspect=1';
	import photo2008DamAtRisk from '../story/sediment/timeline-photos/2008-dam-at-risk.webp?enhanced&w=112&aspect=1';
	import photo2012EngineeringStudies from '../story/sediment/timeline-photos/2012-engineering-studies.webp?enhanced&w=112&aspect=1';
	import photo2016Inspection from '../story/sediment/timeline-photos/2016-inspection.webp?enhanced&w=112&aspect=1';
	import photo2019FinalFeasibilityStudy from '../story/sediment/timeline-photos/2019-final-feasibility-study.webp?enhanced&w=112&aspect=1';
	import photo20222023SouthCarolinaAppropriates from '../story/sediment/timeline-photos/2022-2023-south-carolina-appropriates.webp?enhanced&w=112&aspect=1';
	import photo2022ReservoirShrinks from '../story/sediment/timeline-photos/2022-reservoir-shrinks.webp?enhanced&w=112&aspect=1';
	import photo2024SitePreparationBegins from '../story/sediment/timeline-photos/2024-site-preparation-begins.webp?enhanced&w=112&aspect=1';
	import photo2025ConstructionBegins from '../story/sediment/timeline-photos/2025-construction-begins.webp?enhanced&w=112&aspect=1';
	import photo1863VardryMcBeeDies from './timeline-photos/1863-vardry-mcbee-dies.webp?enhanced&w=112&aspect=1';
	import photo2023ConesteeSellsProperty from './timeline-photos/2023-conestee-sells-property.webp?enhanced&w=112&aspect=1';
	import photo2026HistoricalKioskConstructed from './timeline-photos/2026-historical-kiosk-constructed.webp?enhanced&w=112&aspect=1';

	const story = stories.find((story) => story.href === '/story/timeline');

	// link glossary terms in the timeline
	const linkGlossary: Attachment<HTMLElement> = (element) => {
		let cancelled = false;
		let stopLinkingGlossaryTerms: (() => void) | undefined;

		fetchGlossary()
			.then((glossary) => {
				if (cancelled) return;
				stopLinkingGlossaryTerms = linkGlossaryTerms(element, glossary);
			})
			.catch((error) => console.error('Glossary terms could not be linked:', error));

		return () => {
			cancelled = true;
			stopLinkingGlossaryTerms?.();
		};
	};
</script>

<svelte:head>
	<title>Timeline - Lake Conestee Dam</title>
</svelte:head>

<StoryHeading title="Timeline" summary={story?.description} />

<main class="timeline" {@attach linkGlossary}>
	<Timeline.Track>
		<Timeline.Entry date={1785}>
			{#snippet heading()}
				Early land ownership in the future Lake Conestee area
			{/snippet}
			{#snippet caption()}
				1785
			{/snippet}

			<p>
				Land records show early ownership of property in the area that would become part of the Lake
				Conestee site. The development of multiple dams and mills is known to have occurred as early
				as the 1790s.
			</p>

			<p>
				The first land grant along the Reedy River is made, followed by another in 1794, and the
				development of multiple dams and mills.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1793}>
			{#snippet heading()}
				The first dam and mill are built at Lafferty’s Shoal
			{/snippet}
			{#snippet caption()}
				1793
			{/snippet}

			<p>
				Initial dam and mill at Lafferty’s Shoal, owned by John Goodwyn, Gilbert Sweat, and later
				Carruth & Alston.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1815}>
			{#snippet heading()}
				Carruth’s Armory builds a dam and begins manufacturing muskets
			{/snippet}
			{#snippet caption()}
				1815
			{/snippet}

			<p>
				A dam associated with Carruth’s Armory is documented and known to be near the upper end of
				what would be the future Lake Conestee. Carruth’s armory, which had now constructed a musket
				factory and accompanying dam, begins manufacturing muskets for the cause of the War of 1812.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1820}>
			{#snippet heading()}
				A village develops around the mills
			{/snippet}
			{#snippet caption()}
				1820
			{/snippet}

			<p>A village is developed around the mills at the Reedy River.</p>
		</Timeline.Entry>

		<Timeline.Entry date={1824}>
			{#snippet heading()}
				Carruth’s Armory fails and its property is sold
			{/snippet}
			{#snippet caption()}
				1824
			{/snippet}

			<p>
				Carruth’s Armory failed, and the 900-acre property was seized by the Greenville Sheriff. The
				property was then sold to Robert Anderson.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1826}>
			{#snippet heading()}
				Fire destroys the Carruth’s Armory dam
			{/snippet}
			{#snippet caption()}
				1826
			{/snippet}

			<p>
				The dam associated with Carruth’s Armory was completely destroyed by a fire (leaving no dam
				at that site until 1834).
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1831} icon={{ src: photo1831TimberDam, alt: '' }}>
			{#snippet heading()}
				Vardry McBee builds the earliest documented dam at the Conestee Mill site
			{/snippet}
			{#snippet caption()}
				1831
			{/snippet}

			<p>
				Vardry McBee constructed the earliest dam documented at the future site of Conestee Mill.
				This dam powered his textile operations (Reedy River Factory). That dam was likely a timber
				crib-and-plank structure. A grist and sawmill were operating just upstream as early as the
				1790s, but site conditions suggest a dam did not power it.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/1831-timber-dam.webp"
				alt="Remains of a timber frame-and-plank dam at Glendale, similar to the type of dam McBee likely built"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={{ start: 1834, end: 1842 }}>
			{#snippet heading()}
				A new dam and paper mill are built at the former Carruth site
			{/snippet}
			{#snippet caption()}
				1834–1842
			{/snippet}

			<p>
				Andrew Patterson erected a new dam at the former Carruth site (1834) and operated a paper
				mill (1836). Benajah Dunham acquired it in 1840, elevated the dam, and took over operations
				following a legal dispute in 1842.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1862}>
			{#snippet heading()}
				Vardry McBee sells the Reedy River Factory
			{/snippet}
			{#snippet caption()}
				1862
			{/snippet}

			<p>
				Vardry McBee sold his Reedy River Factory property to Grady, Hawthorn, & Perry for $21,000,
				placing the mill under CSA Quartermaster control during the Civil War.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1863} icon={{ src: photo1863VardryMcBeeDies, alt: '' }}>
			{#snippet heading()}
				Vardry McBee dies
			{/snippet}
			{#snippet caption()}
				1863
			{/snippet}

			<p>Death of Vardry McBee.</p>

			<enhanced:img
				src="./timeline-photos/1863-vardry-mcbee-dies.webp"
				alt="Portrait of Vardry McBee by William Garl Browne Jr."
			/>
		</Timeline.Entry>

		<Timeline.Entry date={{ start: 1875, end: 1877 }}>
			{#snippet heading()}
				The Reedy River Manufacturing Company is chartered
			{/snippet}
			{#snippet caption()}
				1875 & 1877
			{/snippet}

			<p>
				The Reedy River Manufacturing Company (RRMC) received its first charter in 1875 with Joseph
				A. David as president. Joel D. Charles took over management in 1877 when David fell ill.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1885} icon={{ src: photo1885WoodenDam, alt: '' }}>
			{#snippet heading()}
				Federal water power census confirms wooden dams on the Reedy River
			{/snippet}
			{#snippet caption()}
				1885
			{/snippet}

			<p>
				A Federal census of water power in the region confirmed a wooden dam in existence at the
				Reedy River Manufacturing Company (RRMC) site. Another wooden dam was still present at the
				location of the old Carruth’s Armory, one mile upstream.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/1885-wooden-dam.webp"
				alt="1884 Sanborn fire insurance map of the Reedy River Manufacturing Company"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={1890}>
			{#snippet heading()}
				Land is acquired for a new dam and reservoir
			{/snippet}
			{#snippet caption()}
				1890
			{/snippet}

			<p>
				Lidie Morgan purchased the 50-acre Gun Factory / Dunham paper mill tract and sold it to RRMC
				specifically to construct a new dam and clear area for reservoir flooding.
			</p>
		</Timeline.Entry>

		<Timeline.Entry
			date={{ start: 1890, end: 1915 }}
			icon={{ src: photo18901915TextileMillsBuilt, alt: '' }}
		>
			{#snippet heading()}
				Major textile mills are built along the Reedy River
			{/snippet}
			{#snippet caption()}
				1890-1915
			{/snippet}

			<p>
				Construction of ~12 major textile mills along the Reedy River. In 1930, the mill villages
				had an estimated population of 29,000 residents.
			</p>

			<enhanced:img
				src="../story/pollution/timeline-photos/1890-1915-textile-mills-built.webp"
				alt="Monaghan Mills, American Spinning Company, and F.W. Poe Manufacturing Company, viewed from Woodside Mill, circa 1905"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={1892}>
			{#snippet heading()}
				Greenville constructs a sewer system that discharges into the Reedy River
			{/snippet}
			{#snippet caption()}
				1892
			{/snippet}

			<p>
				A sewer system is constructed for the City of Greenville; the collection system, which did
				not have an accompanying treatment facility, discharges at the junction of Richland Creek
				and Reedy River (present-day Cleveland Park).
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1892} icon={{ src: photo1892StoneDamCompleted, alt: '' }}>
			{#snippet heading()}
				The stone-masonry Lake Conestee Dam is completed
			{/snippet}
			{#snippet caption()}
				1892
			{/snippet}

			<p>
				The stone-masonry dam built on the Reedy River here, by Joel D. Charles, is completed. It
				provided mechanical power to his growing Reedy River Manufacturing Company’s textile
				factory. This structure was a remarkable feat of engineering and construction for its time.
				It created a large reservoir of roughly 130 acres.
			</p>

			<p>
				The Reedy River Manufacturing Company built a dam across the Reedy River to provide
				mechanical power for its growing textile factory. This dam and power works were first
				converted to hydroelectric power in 1916, providing more power for what was then Conestee
				Mill. The 1892 stone-masonry dam was a remarkable construction achievement when it was
				built. It created a large reservoir, extraordinary for its time at 140 acres.
			</p>

			<p>
				(This dam remains today, though it is now submerged by the New Lake Conestee Dam, which was
				completed in 2025 and is located immediately downstream of the old dam. This new structure
				provides a ‘containment barrier’ to keep the massive amount of contaminated sediment behind
				it from being released if the old dam were to fail.)
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/1892-stone-dam-completed.webp"
				alt="Early photograph of the Conestee Mill and the stone-masonry dam, circa 1910s"
			/>

			<enhanced:img
				src="../story/pollution/timeline-photos/1892-dam-built.webp"
				alt="1893 Sanborn fire insurance map of the Reedy River Manufacturing Company cotton mills"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={1908} icon={{ src: photo1908RecordFlood, alt: '' }}>
			{#snippet heading()}
				Flood ‘of Biblical proportion’
			{/snippet}
			{#snippet caption()}
				1908
			{/snippet}

			<p>
				The record flood of 1908 occurs in this region, described as ‘of Biblical proportion.’ The
				stone-masonry dam survives but has incurred limited damage. Two of the factory’s three
				operational floors were severely flooded. This flood destroyed many bridges, roads, and
				other structures.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/1908-record-flood.webp"
				alt="August 26, 1908 Lexington Dispatch article reporting flood damage at the Reedy River factory near Greenville"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={1909}>
			{#snippet heading()}
				Conestee Mills is chartered
			{/snippet}
			{#snippet caption()}
				1909
			{/snippet}

			<p>
				RRMC went through receivership and was sold at a referee’s sale to W.E. Beattie &
				Associates. Conestee Mills was officially chartered in July 1909, with 28-year-old T.I.
				Charles as president.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1915}>
			{#snippet heading()}
				Typhoid fever breaks out in Conestee and Greenville
			{/snippet}
			{#snippet caption()}
				1915
			{/snippet}

			<p>
				Typhoid fever broke out in Conestee and the greater Greenville area. Employees at Conestee
				Mills abandoned their houses along the Reedy River and, in 1916, refused to move into new
				houses near the reservoir and along the river.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1917}>
			{#snippet heading()}
				Cattle die from drinking Reedy River water
			{/snippet}
			{#snippet caption()}
				1917
			{/snippet}

			<p>Cattle in pastures died from drinking water from the Reedy River.</p>
		</Timeline.Entry>

		<Timeline.Entry date={1919}>
			{#snippet heading()}
				The Conestee Village company store is built
			{/snippet}
			{#snippet caption()}
				1919
			{/snippet}

			<p>Construction of the Conestee Village company store.</p>
		</Timeline.Entry>

		<Timeline.Entry date={1923} icon={{ src: photo1923ConditionsAtTheirWorst, alt: '' }}>
			{#snippet heading()}
				City determines need for a sewage disposal plant
			{/snippet}
			{#snippet caption()}
				1923
			{/snippet}

			<p>
				The City determined a need for a sewage disposal plant for Greenville. Reedy River and Lake
				Conestee conditions “at their worst.”
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1925} icon={{ src: photo1925ConesteeSues, alt: '' }}>
			{#snippet heading()}
				Conestee Mills sues the City of Greenville due to raw sewage
			{/snippet}
			{#snippet caption()}
				1925
			{/snippet}

			<p>
				Conestee Mills sued the City of Greenville for financial damages due to raw sewage
				contaminating Lake Conestee and Reedy River: “The water has become so foul and contaminated
				as to be a source of disease and constant peril to the health and lives of the operatives of
				Conestee Mills.” (Conestee Mills v. City of Greenville, amended complaint 1929).
			</p>

			<enhanced:img
				src="../story/pollution/timeline-photos/1925-conestee-sues.webp"
				alt="First page of the South Carolina Supreme Court opinion in Conestee Mills v. City of Greenville"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={1926}>
			{#snippet heading()}
				Greater Greenville Sanitation District is created
			{/snippet}
			{#snippet caption()}
				1926
			{/snippet}

			<p>
				The Greater Greenville Sanitation District is created (now ReWa), tasked with overseeing the
				construction of Greenville’s first ‘modern’ wastewater treatment plant.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1928}>
			{#snippet heading()}
				Greenville’s first wastewater treatment plant is constructed
			{/snippet}
			{#snippet caption()}
				1928
			{/snippet}

			<p>
				The first wastewater treatment plant to serve the City of Greenville was constructed at the
				present Mauldin Road plant facility site. The Greater Greenville Sanitary Commission built
				the plant, which was subsequently WCRSA and is now ReWa.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1928}>
			{#snippet heading()}
				Mills Mill discharges sewage into a nearby stream
			{/snippet}
			{#snippet caption()}
				1928
			{/snippet}

			<p>Mills Mill (Brushy Creek) discharged sewage into a nearby stream.</p>
		</Timeline.Entry>

		<Timeline.Entry date={1930}>
			{#snippet heading()}
				Conestee Mills president testifies about gas plant pollution
			{/snippet}
			{#snippet caption()}
				1930
			{/snippet}

			<p>
				President of Conestee Mills testified, “Gas plant emptying sulfur, acids, and poisons that
				killed fish (in Lake Conestee).”
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1931} icon={{ src: photo1931Settlement, alt: '' }}>
			{#snippet heading()}
				Conestee Mills v. City of Greenville is settled
			{/snippet}
			{#snippet caption()}
				1931
			{/snippet}

			<p>
				After two rounds of hearings by the SC Supreme Court, the parties reached a settlement. Six
				years of litigation in Conestee Mills v. City of Greenville resulted in the City of
				Greenville paying $75,000 in financial damages.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={{ start: 1931, end: 1999 }}>
			{#snippet heading()}
				Mills close, but legacy pollution remains
			{/snippet}
			{#snippet caption()}
				1931-1999
			{/snippet}

			<p>
				During the Great Depression, Conestee Mills closed in 1939 and never operated again as a
				locally owned textile plant. Over the next several decades, other mills are sold and cease
				operations, marking the sunset of Greenville’s days as the “Textile Center of the World.”
			</p>

			<p>
				Remedial activities to address legacy pollution at many sites are ongoing. For example,
				substantial cleanup at Union Bleachery has occurred, and the Broad Street Manufactured Gas
				Plant has been thoroughly remediated. Still other sites, such as the Bramlett Manufactured
				Gas Plant, have undergone substantial cleanup efforts, but an additional major remediation
				project is planned there.
			</p>

			<p>
				Some sites, such as the Greenville Steam Plant, a coal-fired power plant operating from 1909
				to the 1950s, have received little attention, although they certainly had a significant
				impact. Although much has been learned about industrial contamination in this watershed
				since the 1970s, new sites and sources of contamination will continue to be recognized.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1943} icon={{ src: photo1943ArmyBaseBuilt, alt: '' }}>
			{#snippet heading()}
				Greenville Army Air Base is constructed
			{/snippet}
			{#snippet caption()}
				1943
			{/snippet}

			<p>
				The construction of the Greenville Army Air Base (Donaldson Air Force Base) occurs.
				Sediments associated with development and runoff from the northern portion of the
				installation may have contributed to sediment loading in Marrow Bone Creek, a tributary of
				the Reedy River.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/1943-army-base-built.webp"
				alt="April 1955 aerial photograph showing the runways of the former Greenville Army Air Base, then Donaldson Air Force Base"
			/>
		</Timeline.Entry>

		<Timeline.Entry
			date={{ start: 1950, end: 1969 }}
			icon={{ src: photo1950s1960sFirstLandfill, alt: '' }}
		>
			{#snippet heading()}
				First municipal landfill operates along the Reedy River
			{/snippet}
			{#snippet caption()}
				1950s-1960s
			{/snippet}

			<p>
				First municipal landfill is constructed and in operation along the banks of the Reedy River.
				The Greenville Technical College campus is now located at this site.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/1950s-1960s-first-landfill.webp"
				alt="Aerial photograph marking the former city landfill, now the Greenville Technical College campus"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={{ start: 1959, end: 1964 }}>
			{#snippet heading()}
				Interstate 85 is constructed through Greenville
			{/snippet}
			{#snippet caption()}
				1959-1964
			{/snippet}

			<p>
				Interstate 85 is constructed through the Greenville area, adding substantial infrastructure
				and associated land disturbance upstream of Lake Conestee.
			</p>
		</Timeline.Entry>

		<Timeline.Entry
			date={{ start: 1960, end: 1979 }}
			icon={{ src: photo1960s1970sSecondLandfill, alt: '' }}
		>
			{#snippet heading()}
				Second municipal landfill operates along the Reedy River
			{/snippet}
			{#snippet caption()}
				1960s-1970s
			{/snippet}

			<p>
				Second municipal landfill is constructed and is in operation along the banks of the Reedy
				River. This landfill was closed in the early 1990s.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/1960s-1970s-second-landfill.webp"
				alt="Map marking the former city landfill along the Reedy River, in operation from the 1960s to the 1980s"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={{ start: 1963, end: 1984 }}>
			{#snippet heading()}
				Interstate 385 is constructed in phases
			{/snippet}
			{#snippet caption()}
				1963-1984
			{/snippet}

			<p>
				Interstate 385 is constructed in phases, bringing additional road development and associated
				stormwater runoff and sediment to Lake Conestee.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1972}>
			{#snippet heading()}
				Federal Clean Water Act is signed into law
			{/snippet}
			{#snippet caption()}
				1972
			{/snippet}

			<p>
				The Federal Clean Water Act (CWA) is signed, establishing a strong regulatory authority to
				protect the nation’s waters, ambitiously aspiring to make them all ‘fishable and swimmable.’
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1983}>
			{#snippet heading()}
				South Carolina’s Erosion and Sediment Reduction Act is enacted
			{/snippet}
			{#snippet caption()}
				1983
			{/snippet}

			<p>
				South Carolina’s Erosion and Sediment Reduction Act strengthened requirements to control
				erosion and sedimentation from land-disturbing activities.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1987}>
			{#snippet heading()}
				South Carolina’s Pollution Control Act is enacted
			{/snippet}
			{#snippet caption()}
				1987
			{/snippet}

			<p>
				South Carolina’s Pollution Control Act provided a broader state framework for environmental
				pollution control.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1991}>
			{#snippet heading()}
				South Carolina’s Stormwater Management and Sediment Reduction Act is enacted
			{/snippet}
			{#snippet caption()}
				1991
			{/snippet}

			<p>
				South Carolina’s Stormwater Management and Sediment Reduction Act established additional
				requirements for managing stormwater runoff and sediment.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={1999} icon={{ src: photo1999FoundationChartered, alt: '' }}>
			{#snippet heading()}
				Conestee Foundation is chartered
			{/snippet}
			{#snippet caption()}
				1999
			{/snippet}

			<p>Conestee Foundation is chartered as a 501(c)3 public nonprofit organization.</p>
		</Timeline.Entry>

		<Timeline.Entry date={2000} icon={{ src: photo2000FoundationAcquires, alt: '' }}>
			{#snippet heading()}
				Conestee Foundation acquires the Lake Conestee Dam and Reservoir
			{/snippet}
			{#snippet caption()}
				2000
			{/snippet}

			<p>
				Conestee Foundation acquires the Lake Conestee Dam and Reservoir, initiates decades of
				assessments, studies, design, and permitting, and enters a Voluntary Cleanup Contract (VCC)
				to establish a long-term management plan for the Lake Conestee Site.
			</p>

			<enhanced:img
				src="../story/pollution/timeline-photos/2000-foundation-acquires.webp"
				alt="Water flowing over the 1892 Lake Conestee Dam"
			/>
		</Timeline.Entry>

		<Timeline.Entry
			date={{ start: 2000, end: 2001 }}
			icon={{ src: photo20002001ConesteeCanyon, alt: '' }}
		>
			{#snippet heading()}
				A penstock blockage fails, carving the “Conestee Canyon”
			{/snippet}
			{#snippet caption()}
				2000–2001
			{/snippet}

			<p>
				A blockage upstream of the penstock gate spontaneously failed, allowing the entire Reedy
				River flow to pass through the dam via the 8-ft diameter penstock orifice. The former pool
				of the Lake quickly disappeared, and the river “Conestee Canyon” flowed through the
				sediments of the reservoir. Over the ensuing 12 months, more than 90,000 cubic yards of
				contaminated sediment were released through the dam into the downstream Reedy. In June 2001,
				temporary gate repairs were completed to halt the erosion and restore containment.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/2000-2001-conestee-canyon.webp"
				alt="The Reedy River cutting through exposed reservoir sediments in November 2000"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2000} icon={{ src: photo20002003Sampling, alt: '' }}>
			{#snippet heading()}
				Sampling of the former reservoir reveals widespread contamination
			{/snippet}
			{#snippet caption()}
				Early 2000s
			{/snippet}

			<p>
				An extensive program of sampling of sediment, surface water, and groundwater was conducted
				over the entirety of the former reservoir area. Environmental investigations revealed
				metals, pesticides, polychlorinated biphenyls (PCBs), polycyclic aromatic hydrocarbons
				(PAHs), and other contaminants of concern throughout the Lake’s soils and sediments. Lower
				concentrations were found in water and groundwater. These investigations established that
				the sediments and soils were extensively contaminated by a broad array of 20th-century
				toxins, at concentrations exceeding applicable human health and ecological screening
				criteria.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/2000-2003-sampling.webp"
				alt="Field crew collecting samples in the former reservoir"
			/>

			<enhanced:img
				src="../story/sediment/timeline-photos/2000s-contamination.webp"
				alt="Map from the Lake Conestee Ecological Risk Assessment showing contaminant concentrations across the former reservoir"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2004}>
			{#snippet heading()}
				SCDHEC determines Lake Conestee is a ‘National Priorities List-Caliber’ site
			{/snippet}
			{#snippet caption()}
				2004
			{/snippet}

			<p>
				SCDHEC determined that the Lake Conestee site was a ‘National Priorities List-Caliber’ site.
				This meant that contamination at the site posed an imminent threat to the public and that it
				would potentially fully qualify for addition to the Federal Superfund list.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={2006}>
			{#snippet heading()}
				The Voluntary Cleanup Contract is completed and a Restrictive Covenant is established
			{/snippet}
			{#snippet caption()}
				2006
			{/snippet}

			<p>
				The VCC was certified as completed, and a Restrictive Covenant was established specifying
				how the reservoir site must be managed going forward. Elements of this agreement required
				the Foundation to manage the Lake to keep contaminated sediments in place, limit disturbance
				of the site, monitor the site’s natural recovery, and prevent human exposure to the
				contaminants present at the site. The cornerstone of this strategy was to maintain the Lake
				Conestee Dam and to minimize the migration of contaminated sediments downstream.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={2006}>
			{#snippet heading()}
				The Lake Conestee Dam is up-classified to ‘Significant Risk’
			{/snippet}
			{#snippet caption()}
				2006
			{/snippet}

			<p>
				The Lake Conestee Dam was up-classified to a ‘Significant Risk’ status due to revelations of
				contamination within the structure. This was the first instance of SCDHEC upgrading the risk
				classification of a dam in SC due to associated contamination issues.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={2008} icon={{ src: photo2008DamAtRisk, alt: '' }}>
			{#snippet heading()}
				First engineering feasibility study finds the dam at risk of failure
			{/snippet}
			{#snippet caption()}
				2008
			{/snippet}

			<p>
				The first engineering feasibility study assessed the condition of the dam, revealing it to
				be in poor condition, progressively falling apart, unstable, and at risk of catastrophic
				failure.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={2012} icon={{ src: photo2012EngineeringStudies, alt: '' }}>
			{#snippet heading()}
				Engineering studies examine alternatives for the deteriorating dam
			{/snippet}
			{#snippet caption()}
				2012 onward
			{/snippet}

			<p>
				Engineering studies examined the deteriorating dam and alternatives for addressing its
				structural risks without mobilizing contaminated sediment.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/2012-engineering-studies.webp"
				alt="The 1892 Lake Conestee Dam in October 2012"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2014}>
			{#snippet heading()}
				Conestee Mill is added to the National Register of Historic Places
			{/snippet}
			{#snippet caption()}
				2014
			{/snippet}

			<p>
				The Conestee Mill / Reedy River Manufacturing site is approved by the US Department of the
				Interior for addition to the National Register of Historic Places on January 14, 2014.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={2016} icon={{ src: photo2016Inspection, alt: '' }}>
			{#snippet heading()}
				Dam inspection confirms significant structural concerns
			{/snippet}
			{#snippet caption()}
				2016
			{/snippet}

			<p>
				A dam inspection confirmed significant structural concerns, including deterioration and
				seepage, heightening the need for a long-term solution.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/2016-inspection.webp"
				alt="The stone-masonry wall of the 1892 Lake Conestee Dam in December 2016"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2019} icon={{ src: photo2019FinalFeasibilityStudy, alt: '' }}>
			{#snippet heading()}
				Final feasibility study recommends a new downstream dam
			{/snippet}
			{#snippet caption()}
				2019
			{/snippet}

			<p>
				A final, definitive engineering feasibility rigorously reviewed all possible approaches to
				addressing the old dam and assured long-term containment of contaminated sediments upstream
				of the 1892 dam. This study identified the Recommended Alternative to be a new concrete dam
				to be constructed downstream of the old one.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/2019-final-feasibility-study.webp"
				alt="The 1892 Lake Conestee Dam and its headrace in April 2019"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2022} icon={{ src: photo2022ReservoirShrinks, alt: '' }}>
			{#snippet heading()}
				The reservoir shrinks to about 12 acres
			{/snippet}
			{#snippet caption()}
				2022
			{/snippet}

			<p>
				The reservoir is reported to have shrunk from approximately 135 acres to about 12 acres,
				with an estimated 3.25 million cubic yards of sediment accumulated behind the dam.
			</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/2022-reservoir-shrinks.webp"
				alt="Aerial view of the 1892 Lake Conestee Dam and the sediment-filled reservoir behind it in 2022"
			/>
		</Timeline.Entry>

		<Timeline.Entry
			date={{ start: 2022, end: 2023 }}
			icon={{ src: photo20222023SouthCarolinaAppropriates, alt: '' }}
		>
			{#snippet heading()}
				South Carolina appropriates $39 million for a new dam
			{/snippet}
			{#snippet caption()}
				2022-2023
			{/snippet}

			<p>
				The South Carolina General Assembly appropriated $39 million toward the completion of a
				detailed design for a new dam and for its construction. Additional support from other units
				of government and others brought the total construction and long-term care budget for the
				project to roughly $50 million.
			</p>
		</Timeline.Entry>

		<Timeline.Entry date={2023} icon={{ src: photo2023ConesteeSellsProperty, alt: '' }}>
			{#snippet heading()}
				Conestee Foundation sells the dam to the Lake Conestee Dam Rehabilitation Project
			{/snippet}
			{#snippet caption()}
				2023
			{/snippet}

			<p>
				Conestee Foundation sold the dam and adjacent property to the Lake Conestee Dam
				Rehabilitation Project (LCDRP).
			</p>

			<enhanced:img
				src="./timeline-photos/2023-conestee-sells-property.webp"
				alt="Lake Conestee Dam Restoration Project sign at the dam site"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2024} icon={{ src: photo2024SitePreparationBegins, alt: '' }}>
			{#snippet heading()}
				Property acquisition and site preparation begin
			{/snippet}
			{#snippet caption()}
				2024
			{/snippet}

			<p>Property acquisition, planning, and site preparation for the new dam began.</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/2024-site-preparation-begins.webp"
				alt="Excavator with a mulching head clearing trees for the new dam"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2025} icon={{ src: photo2025ConstructionBegins, alt: '' }}>
			{#snippet heading()}
				Construction of the replacement dam begins
			{/snippet}
			{#snippet caption()}
				February 2025
			{/snippet}

			<p>Construction of the replacement dam began.</p>

			<enhanced:img
				src="../story/sediment/timeline-photos/2025-construction-begins.webp"
				alt="Aerial photograph of construction of the new dam downstream of the 1892 dam in June 2025"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2025} icon={{ src: photo2025NewDamCompleted, alt: '' }}>
			{#snippet heading()}
				New Lake Conestee Dam is completed
			{/snippet}
			{#snippet caption()}
				October 2025
			{/snippet}

			<p>
				A new dam is completed in October 2025, immediately downstream of the old 1892 Lake Conestee
				Dam. Water began flowing over the newly constructed dam, marking a major milestone in
				eliminating the risk of failure of the then 133-year-old dam, never intended to provide a
				waste repository, or to even last for more than 50 years. Thanks to the dedication of the
				Lake Conestee Dam Rehabilitation Project, the old Lake Conestee Dam no longer presents a
				risk of physical failure and the catastrophic release of massive quantities of contaminated
				sediments downstream.
			</p>

			<enhanced:img
				src="../story/pollution/timeline-photos/2025-new-dam-completed.webp"
				alt="Aerial photograph of water flowing over the completed new Lake Conestee Dam in October 2025"
			/>

			<enhanced:img
				src="../story/sediment/timeline-photos/2025-water-flows-over-new-dam.webp"
				alt="Water flowing over the newly constructed Lake Conestee Dam in August 2025"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2026} icon={{ src: photo2026HistoricalKioskConstructed, alt: '' }}>
			{#snippet heading()}
				A historical kiosk is constructed on site
			{/snippet}
			{#snippet caption()}
				2026
			{/snippet}

			<p>
				A historical kiosk to acknowledge the past is constructed on site to educate visitors, as
				well as fencing and other protective measures.
			</p>

			<enhanced:img
				src="./timeline-photos/2026-historical-kiosk-constructed.webp"
				alt="Covered historical kiosk beside a gravel path near the dam, with the Conestee Mill building in the background"
			/>
		</Timeline.Entry>

		<Timeline.Entry date={2027} icon={{ src: photo2027TakeOwnership, alt: '' }}>
			{#snippet heading()}
				Lake Conestee Dam Authority expected to take ownership
			{/snippet}
			{#snippet caption()}
				2027 (Pending Legislative Action)
			{/snippet}

			<p>
				Today, the new dam is owned by the Lake Conestee Dam Rehabilitation Project, LLC. Pending
				legislative authorization, a new governmental entity (the Lake Conestee Dam Authority) is
				expected to take ownership of the dam in 2027. That entity will be responsible for ongoing
				maintenance and monitoring of the dam. The agency will be overseen by appointed
				representatives from Greenville, Laurens, and Greenwood Counties.
			</p>

			<enhanced:img
				src="../story/pollution/timeline-photos/2027-take-ownership.webp"
				alt="Aerial photograph of the completed new Lake Conestee Dam and the Conestee Mill buildings in October 2025"
			/>
		</Timeline.Entry>
	</Timeline.Track>
</main>

<style>
	:global(:root:has(main.timeline)) {
		color-scheme: light dark;
	}

	.timeline {
		--gutter: 1rem;
		box-sizing: border-box;
		max-width: calc(52rem + 2 * var(--gutter));
		margin: 0 auto;
		padding: 1.5rem var(--gutter) 6rem;
		color: var(--color-text);
		line-height: 1.55;
	}

	/* match the glossary term style used in the StoryMaps stories */
	.timeline :global(a.glossary-term) {
		color: inherit;
		font: inherit;
		text-decoration-line: underline;
		text-decoration-style: dotted;
		text-decoration-thickness: 1.5px;
		text-decoration-color: var(--color-accent);
		text-underline-offset: 0.2em;
		cursor: help;
	}
	.timeline :global(a.glossary-term:hover) {
		text-decoration-style: solid;
		color: var(--color-accent);
	}
</style>
