<script lang="ts">
	import { Timeline } from '$lib/components';

	import photo18901915TextileMillsBuilt from './timeline-photos/1890-1915-textile-mills-built.webp?enhanced&w=112&aspect=1';
	import photo1892DamBuilt from './timeline-photos/1892-dam-built.webp?enhanced&w=112&aspect=1';
	import photo1923ConditionsAtTheirWorst from './timeline-photos/1923-conditions-at-their-worst.webp?enhanced&w=112&aspect=1';
	import photo1925ConesteeSues from './timeline-photos/1925-conestee-sues.webp?enhanced&w=112&aspect=1';
	import photo1931Settlement from './timeline-photos/1931-settlement.webp?enhanced&w=112&aspect=1';
	import photo1999FoundationChartered from './timeline-photos/1999-foundation-chartered.webp?enhanced&w=112&aspect=1';
	import photo2000FoundationAcquires from './timeline-photos/2000-foundation-acquires.webp?enhanced&w=112&aspect=1';
	import photo2025NewDamCompleted from './timeline-photos/2025-new-dam-completed.webp?enhanced&w=112&aspect=1';
	import photo2027TakeOwnership from './timeline-photos/2027-take-ownership.webp?enhanced&w=112&aspect=1';
</script>

<Timeline.Track>
	<Timeline.Entry date={1794}>
		{#snippet heading()}
			First land grants along the Reedy River
		{/snippet}
		{#snippet caption()}
			1794
		{/snippet}

		<p>
			The first land grants along the upper Reedy River were made after the Revolutionary War.
			Wherever grants included a river shoals, dams and mills would quickly follow. One grant was
			made in 1794, at the place that would become known as “Reedy River.” Around a grist mill, a
			sawmill, and then a textile factory a village grew. After over more than a century, the
			factory and the village was renamed Conestee.
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={1815}>
		{#snippet heading()}
			Carruth’s armory begins manufacturing muskets
		{/snippet}
		{#snippet caption()}
			1815
		{/snippet}

		<p>
			In response to the War of 1812, Carruth constructs a musket factory to build standardized
			“Springfield” long rifles under government contracts. Located one mile upstream from Conestee,
			Carruth used a dam on the Reedy to power his operation.
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={1820}>
		{#snippet heading()}
			A village develops around the mills
		{/snippet}
		{#snippet caption()}
			1820
		{/snippet}

		<p>Wherever dams and mills were constructed along the river, settlements soon followed.</p>
	</Timeline.Entry>

	<Timeline.Entry date={1831}>
		{#snippet heading()}
			McBee constructs dam
		{/snippet}
		{#snippet caption()}
			1831
		{/snippet}

		<p>
			At Reedy River, Vardry McBee constructs a dam and Reedy River Factory at Conestee. Here he
			produced woolen and cotton goods and manufactured paper.
		</p>
	</Timeline.Entry>
	<Timeline.Entry date={1861}>
		{#snippet heading()}
			Civil War production
		{/snippet}
		{#snippet caption()}
			1861
		{/snippet}

		<p>
			During the Civil War, Reedy River Factory was fully engaged in producing uniforms and other
			supplies for the Confederacy.
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

		<p>Construction of ~12 major textile mills along the Reedy River.</p>

		<enhanced:img
			src="./timeline-photos/1890-1915-textile-mills-built.webp"
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
			The City of Greenville constructs its first sewage collection system. It simply conveniently
			piped the waste downstream, discharging it at the junction of Richland Creek and Reedy River
			(present-day Cleveland Park).
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={1892} icon={{ src: photo1892DamBuilt, alt: '' }}>
		{#snippet heading()}
			Reedy River Manufacturing Company builds the Lake Conestee Dam
		{/snippet}
		{#snippet caption()}
			1892
		{/snippet}

		<p>
			The Reedy River Manufacturing Company, under the leadership of Joel D. Charles, builds a new
			dam across the Reedy River to provide mechanical power for its growing textile factory. The
			1892 stone-masonry dam was a remarkable engineering and construction achievement when it was
			built, taller and longer than any similar dam in the upstate. It created a large reservoir,
			extraordinary for its time at roughly 140 acres. This dam and power works were first converted
			to hydroelectric power production in 1916. This dam remains today, though it is now submerged
			by the New Lake Conestee Dam, which was completed in 2025. This new structure eliminates the
			very serious concern that the old dam could fail at any time. The new dam provides a
			'containment barrier' to keep the massive amount of contaminated sediment behind the old dam
			from being released in the event of a failure.
		</p>

		<enhanced:img
			src="./timeline-photos/1892-dam-built.webp"
			alt="1893 Sanborn fire insurance map of the Reedy River Manufacturing Company cotton mills"
		/>
	</Timeline.Entry>
	<Timeline.Entry date={1908}>
		{#snippet heading()}
			Flood of record
		{/snippet}
		{#snippet caption()}
			1908
		{/snippet}

		<p>
			The flood of record occurred in August 1908. Some accounts reported the dam had been
			destroyed, but this was not the case. There had been only limited damage to the dam. The
			impacts inside the mill were far worse, where the lower two floors of equipment, materials in
			process, and products were flooded. It took a year for the mill to be retooled and come back
			on line.
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
			Typhoid fever, due to contaminated water, broke out in Conestee and the greater Greenville
			area. Employees at Conestee Mills abandoned their houses along the Reedy River and, in 1916,
			refused to move into new houses near the reservoir and along the river.
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
			contaminating Lake Conestee and Reedy River: “The water has become so foul and contaminated as
			to be a source of disease and constant peril to the health and lives of the operatives of
			Conestee Mills.” (Conestee Mills v. City of Greenville, amended complaint 1929).
		</p>

		<enhanced:img
			src="./timeline-photos/1925-conestee-sues.webp"
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
			The Greater Greenville Sanitation District is created (now ReWa), resulting in the
			construction of Greenville's first 'modern' wastewater treatment plant.
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

	<Timeline.Entry date={1928}>
		{#snippet heading()}
			Greenville constructs its first sewage treatment facilities
		{/snippet}
		{#snippet caption()}
			1928
		{/snippet}

		<p>
			Greenville constructed its first sewage treatment facilities at the present Mauldin Road
			wastewater treatment plant site. It served most of the then-City, but not the numerous mill
			villages in the watershed above the dam.
		</p>
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
			years of litigation in Conestee Mills v. City of Greenville resulted in the City of Greenville
			paying $100,000 in financial damages.
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
			operations, marking the sunset of Greenville's days as the “Textile Center of the World.”
		</p>

		<p>
			Remedial activities to address legacy pollution at many sites are ongoing. For example,
			substantial cleanup at Union Bleachery has occurred, and the Broad Street Manufactured Gas
			Plant has been thoroughly remediated. Still other sites, such as the Bramlett Manufactured Gas
			Plant, have undergone substantial cleanup efforts, but an additional major remediation project
			is planned there.
		</p>

		<p>
			Some sites, such as the Greenville Steam Plant, a coal-fired power plant operating from 1909
			to the 1950s, have received little attention, although they certainly had a significant
			impact. Although much has been learned about industrial contamination in this watershed since
			the 1970s, new sites and sources of contamination will continue to be recognized.
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
			The Foundation receives a grant from the State to acquire the Lake Conestee Dam and Reservoir.
			The grant came from the State's civil settlement with Colonial Pipeline, following its
			devastating 1996 petroleum spill to the lower Reedy River, downstream of Conestee. This was
			the first project authorized under the Reedy River Restoration Fund.
		</p>
		<p>
			The purchase required extensive assessment of contamination of the former reservoir under a
			Voluntary Cleanup Contract. Those initial efforts were completed, and a Restrictive Covenant
			was formalized in 2007. This agreement specified how the lake site and the dam would be
			managed to control the massive amount of hazardous waste present at the site.
		</p>

		<enhanced:img
			src="./timeline-photos/2000-foundation-acquires.webp"
			alt="Water flowing over the 1892 Lake Conestee Dam"
		/>
	</Timeline.Entry>
	<Timeline.Entry date={2004}>
		{#snippet heading()}
			Site qualifies as a 'Superfund-Caliber' site
		{/snippet}
		{#snippet caption()}
			2004
		{/snippet}

		<p>
			Based on extensive sampling of sediment, soils, and waters of the old reservoir, SCDHEC
			determines the Lake Conestee Site qualifies as a federal “Superfund-Caliber” Site. This
			information was critical input to the management requirements specified in the 2007
			Restrictive Covenant. The site was not put on the federal Superfund List.
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={2008}>
		{#snippet heading()}
			Dam engineering study conducted
		{/snippet}
		{#snippet caption()}
			2008
		{/snippet}

		<p>
			The first of several engineering studies of the old Lake Conestee Dam was conducted. Further
			studies in 2012, 2019, and 2023 examined all feasibility options for rehabilitating or
			replacing the 1892 structure. All studies concluded that due to the age and condition of the
			old dam it could not be rehabilitated at any price. These efforts culminated in the completion
			of the new Lake Conestee Dam in 2025.
		</p>
	</Timeline.Entry>
	<Timeline.Entry date={2024}>
		{#snippet heading()}
			EPA formally recognizes the Lake Conestee Site as a 'Superfund-Caliber' site
		{/snippet}
		{#snippet caption()}
			2024
		{/snippet}

		<p>
			The EPA formally recognizes the “Lake Conestee Site” is a "large, serious, and complex"
			contaminated hazardous waste site, and that it meets all requirements of a federal
			"Superfund-Caliber" site. To avoid putting the Site on the federal Superfund List, EPA assigns
			the Site to SCDES to oversee its long-term care, and to assure contaminants of concern are
			properly managed, and are not allowed to be released downstream. This classification of the
			Site is unrelated to the new dam construction.
		</p>
	</Timeline.Entry>

	<Timeline.Entry date={2025} icon={{ src: photo2025NewDamCompleted, alt: '' }}>
		{#snippet heading()}
			New Lake Conestee Dam is completed
		{/snippet}
		{#snippet caption()}
			2025
		{/snippet}

		<p>
			A new dam is completed in October 2025, funded primarily by the SC General Assembly, with
			limited contributions from others. Located immediately downstream of the old 1892 Lake
			Conestee Dam the new structure provides a “containment barrier” designed to minimize the
			release of legacy contaminants trapped behind the old dam.
		</p>
		<p>
			Thanks to the dedication of the Lake Conestee Dam Rehabilitation Project, the old Lake
			Conestee Dam no longer presents a risk of physical failure and the catastrophic release of
			massive quantities of contaminated sediments downstream.

			<enhanced:img
				src="./timeline-photos/2025-new-dam-completed.webp"
				alt="Aerial photograph of water flowing over the completed new Lake Conestee Dam in October 2025"
			/>
		</p></Timeline.Entry
	>

	<Timeline.Entry date={2027} icon={{ src: photo2027TakeOwnership, alt: '' }}>
		{#snippet heading()}
			Lake Conestee Dam Authority expected to take ownership
		{/snippet}
		{#snippet caption()}
			2027 (Pending Legislative Action)
		{/snippet}

		<p>
			The new dam completed in 2025 is owned by the Lake Conestee Dam Rehabilitation Project, LLC, a
			trust entity created to administer the construction project. Pending legislative
			authorization, a new governmental entity (the Lake Conestee Dam Authority) is expected to take
			ownership of the dam in 2027. That entity will be responsible for ongoing maintenance and
			monitoring of the dam indefinitely. The agency will be overseen by appointed representatives
			from Greenville, Laurens, and Greenwood Counties.
		</p>

		<enhanced:img
			src="./timeline-photos/2027-take-ownership.webp"
			alt="Aerial photograph of the completed new Lake Conestee Dam and the Conestee Mill buildings in October 2025"
		/>
	</Timeline.Entry>
</Timeline.Track>

<style>
	/* undo the margin and padding reset applied by StoryMaps */
	* {
		margin: revert;
		padding: revert;
	}
</style>
