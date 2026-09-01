/* ==================================================================
   DE TECH TIVE — EVIDENCE BOARD  ·  CONTENT
   This is the only file you edit to change what is on the board.
   Full instructions with examples are in GUIDE.md.

   ADD a paper .... copy any { } block below, give it a new id, write
                    its text. It gets a pin, red string and its own
                    page automatically.
   REMOVE a paper . delete its { } block. Strings pointing at it
                    disappear on their own. Nothing else to change.
   MOVE a paper ... change x / y. Delete x / y and it finds an empty
                    spot on the board by itself.
   RESTRING ....... edit "links" — the ids it runs red string to.
   REORDER ........ move a block up or down in the list.

   FIELDS
     id       short unique name. letters, numbers, dashes.
     n        case number printed on the paper. optional.
     title    heading, on the paper and at the top of its page.
     dek      one line under the title on the paper.
     meta     small caps footer strip on the paper. optional.
     look     ''  plain white  ·  v-manila  ·  v-lined  ·  v-graph
              v-photo  ·  v-sticky   (add your own in style.css)
     x, y     position on the 1440 × 980 board. optional.
     w, h     size of the paper. optional, defaults 256 × 206.
     rot      tilt in degrees. optional.
     links    array of other ids to tie red string to.
     lede     italic opening line on its page.
     body     the page itself, written as plain HTML.
     aside    { title, facts: [[label, value], ...] }. optional.
     note     handwritten margin note on the page. optional.
     extra    extra HTML on the paper front, under the dek. optional.
     face     replaces the whole paper front. optional.

   Anything in [SQUARE BRACKETS] wrapped in <span class="ph"> is a
   placeholder. Replace it with a real fact, or delete the line.
   ================================================================== */

const TEAM = {
  name: 'DE <em>TECH</em> TIVE',
  sub: 'Robotics Team <span class="ph">[TEAM #]</span> · Evidence Board',
  legend: 'follow the string —<br>every pin opens a file'
};

const PAPERS = [

  { id: 'about', n: '01', title: 'About De TECH tive', look: 'v-manila',
    dek: 'Who we are, where we build, and why this board is covered in string.',
    meta: 'Origin · Mission · Season',
    x: 90, y: 212, w: 296, h: 214, rot: -3.2,
    links: ['team', 'robot', 'contact'],
    lede: 'A student robotics team that treats every build season like an open case — evidence pinned up, string between the parts that talk to each other.',
    body: `
      <h3>The short version</h3>
      <p>De TECH tive is the <span class="ph">[PROGRAM — FRC / FTC / VEX]</span> robotics team at <span class="ph">[SCHOOL OR ORGANIZATION]</span>. We started in <span class="ph">[FOUNDING YEAR]</span> with <span class="ph">[# OF STUDENTS]</span> students, a folding table, and one borrowed drill.</p>
      <p>Every season we design, build, program and drive a competition robot from scratch in roughly six weeks. The rest of the year goes to training new members, running workshops, and keeping the shop from turning into a scrap pile.</p>
      <h3>What we actually do</h3>
      <p>Students own the work. Mentors ask questions, sign off on safety, and stay out of the way. Design decisions get argued out in front of a whiteboard — which is where this board came from in the first place.</p>
      <p>If you are a student thinking about joining, no experience is required. If you are a parent, mentor or sponsor, the fastest way in is <a href="#contact">the contact file</a>.</p>`,
    aside: { title: 'File facts', facts: [
      ['Founded', '[YEAR]'], ['Team number', '[TEAM #]'], ['Program', '[FRC / FTC]'],
      ['Members', '[COUNT]'], ['Home shop', '[LOCATION]'] ] },
    note: 'bracketed bits are yours to fill in' },

  { id: 'team', n: '02', title: 'The Team', look: 'v-photo',
    dek: 'Six sub-teams, one shop.',
    x: 466, y: 128, w: 252, h: 268, rot: 2.4,
    links: ['robot', 'outreach'],
    face: `
      <div class="photo-frame"><span>[ TEAM PHOTO<br>DROP IMAGE HERE ]</span></div>
      <div class="photo-cap">the crew — <span class="ph">[SEASON]</span></div>`,
    lede: 'Six sub-teams, one shop, and a whiteboard that never gets fully erased.',
    body: `
      <h3>Sub-teams</h3>
      <ul class="roster">
        <li><b>Mechanical</b><span>Chassis, drivetrain, manipulators</span></li>
        <li><b>Electrical</b><span>Wiring, power, pneumatics</span></li>
        <li><b>Programming</b><span>Autonomous, controls, vision</span></li>
        <li><b>CAD</b><span>Modelling, tolerances, fabrication files</span></li>
        <li><b>Drive team</b><span>Driver, operator, human player, coach</span></li>
        <li><b>Outreach &amp; media</b><span>Events, sponsors, documentation</span></li>
      </ul>
      <h3>Leadership</h3>
      <ul class="roster">
        <li><b>[NAME]</b><span>Team captain</span></li>
        <li><b>[NAME]</b><span>Build lead</span></li>
        <li><b>[NAME]</b><span>Software lead</span></li>
        <li><b>[NAME]</b><span>Lead mentor</span></li>
      </ul>`,
    aside: { title: 'Meeting times', facts: [
      ['Pre-season', '[DAYS / TIME]'], ['Build season', '[DAYS / TIME]'],
      ['Shop', '[ROOM / ADDRESS]'], ['New members', 'Always open'] ] },
    note: 'swap the placeholders for real names before this goes live' },

  { id: 'robot', n: '03', title: 'The Robot', look: '',
    dek: '<span class="ph">[ROBOT NAME]</span> — drivetrain, arm, and everything bolted between.',
    x: 826, y: 176, w: 286, h: 202, rot: -1.8,
    links: ['wheels', 'sponsors'],
    extra: `
      <svg class="sketch" width="150" height="46" viewBox="0 0 150 46" aria-hidden="true">
        <rect x="14" y="10" width="86" height="22" rx="2"></rect>
        <circle cx="30" cy="37" r="7"></circle>
        <circle cx="84" cy="37" r="7"></circle>
        <path d="M100,20 L124,8 L138,14"></path>
        <line class="fill-red" x1="138" y1="14" x2="138" y2="26"></line>
      </svg>`,
    lede: '<span class="ph">[ROBOT NAME]</span> — built for the <span class="ph">[SEASON]</span> game, and the reason the shop smells like cut aluminium.',
    body: `
      <h3>Design brief</h3>
      <p>The strategy came first: pick the two scoring actions we could do faster than anyone else, and refuse to build anything that did not serve them. Everything on the robot traces back to that decision.</p>
      <h3>Subsystems</h3>
      <p><b>Drivetrain.</b> <span class="ph">[TYPE — swerve / west coast / mecanum]</span>, <span class="ph">[# MOTORS]</span> motors, <span class="ph">[GEAR RATIO]</span>. Detail of the wheel modules lives in <a href="#wheels">the build log</a>.</p>
      <p><b>Manipulator.</b> <span class="ph">[DESCRIPTION]</span> driven by <span class="ph">[MOTOR / PNEUMATIC]</span>, with <span class="ph">[SENSOR]</span> for position feedback.</p>
      <p><b>Software.</b> Written in <span class="ph">[LANGUAGE]</span> on <span class="ph">[CONTROLLER]</span>. Autonomous routines are selected from the dashboard before the match.</p>`,
    aside: { title: 'Spec sheet', facts: [
      ['Weight', '[LBS / KG]'], ['Footprint', '[W × D]'], ['Height', '[H]'],
      ['Top speed', '[FT/S]'], ['Battery', '[SPEC]'], ['Language', '[JAVA / C++]'] ] },
    note: 'add a photo or a CAD render here once you have one' },

  { id: 'wheels', n: '04', title: 'Wheels Assembly', look: 'v-graph',
    dek: 'Build log: the drivetrain, start to finish.',
    x: 1128, y: 306, w: 258, h: 236, rot: 3.4,
    links: ['sponsors'],
    extra: `
      <svg class="sketch" width="120" height="76" viewBox="0 0 120 76" aria-hidden="true">
        <circle cx="40" cy="38" r="27"></circle>
        <circle cx="40" cy="38" r="9"></circle>
        <line x1="40" y1="11" x2="40" y2="29"></line>
        <line x1="40" y1="47" x2="40" y2="65"></line>
        <line x1="13" y1="38" x2="31" y2="38"></line>
        <line x1="49" y1="38" x2="67" y2="38"></line>
        <path class="fill-red" d="M76,26 L104,26"></path>
        <path class="fill-red" d="M76,50 L104,50"></path>
        <line x1="90" y1="26" x2="90" y2="50"></line>
      </svg>`,
    tabs: [

      { label: 'Wheels Assembly',
        title: 'Wheels Assembly',
        lede: 'The wheel-module build log — what we cut, what we broke, and what we changed after it broke.',
        body: `
          <h3>What a module is made of</h3>
          <p>Two waterjet plates, four bearings, a hub, a wheel and the hardware that keeps all of it in one plane. Nothing on the module is adjustable once it is bolted up, which is deliberate — a module that can be nudged is a module that moves on impact.</p>
          <h3>Log</h3>
          <ul class="log">
            <li><time>[DATE]</time><p>Module design locked in CAD. Bearing bore reamed to <span class="ph">[SIZE]</span>; first plate sent to the router.</p></li>
            <li><time>[DATE]</time><p>Dry fit of module one. Shaft was <span class="ph">[AMOUNT]</span> long — faced it down and re-cut the spacers.</p></li>
            <li><time>[DATE]</time><p>All four modules assembled and torqued. Ran the drivetrain on blocks; one module drew high current under no load — a bearing was seated crooked.</p></li>
            <li><time>[DATE]</time><p>Full-weight drive test. Straight-line tracking within <span class="ph">[TOLERANCE]</span> over ten metres. Called it done.</p></li>
          </ul>
          <h3>What we changed after testing</h3>
          <p><b>Spacer stack.</b> The first version relied on the bolt to set the bearing preload. It did not hold. Now a machined spacer sets it and the bolt only clamps.</p>
          <p><b>Wheel retention.</b> Went from a set screw to a through-bolt after one wheel walked off the hub during a push match.</p>
          <h3>Rebuilding one in the pit</h3>
          <p>Budget <span class="ph">[MINUTES]</span> minutes. Keep one complete spare module built and tested in the crate — swapping a whole module is always faster than diagnosing one between matches.</p>`,
        aside: { title: 'Bill of materials', facts: [
          ['Wheels', '[PART #]'], ['Motors', '[MODEL]'], ['Gearbox', '[RATIO]'],
          ['Bearings', '[SIZE]'], ['Plate stock', '[MATERIAL]'] ] },
        note: 'keep adding entries — a real log beats a tidy one' },

      { label: 'Drivetrain',
        title: 'Drivetrain',
        lede: 'Four modules, one frame, and the gearing that decides whether we win the sprint to the middle.',
        body: `
          <h3>Layout</h3>
          <p><span class="ph">[TYPE — swerve / west coast / mecanum]</span> on a <span class="ph">[W × D]</span> frame, <span class="ph">[# MOTORS]</span> drive motors and <span class="ph">[# MOTORS]</span> steering motors.</p>
          <p>Gearing is <span class="ph">[RATIO]</span>, which puts free speed at <span class="ph">[FT/S]</span> and leaves headroom on current draw when all four modules push at once.</p>
          <h3>Why this ratio</h3>
          <p>We geared for acceleration over top speed. The field is short enough that we spend more time getting up to speed than holding it, and the lower ratio keeps the motors out of the stall region when we get shoved.</p>
          <h3>Known weak points</h3>
          <ul class="log">
            <li><time>Belts</time><p>Tension drifts over a competition day. Checked between every match.</p></li>
            <li><time>Encoders</time><p>Steering zero has to be re-set after a module comes off. Written on the pit whiteboard.</p></li>
          </ul>`,
        aside: { title: 'Numbers', facts: [
          ['Ratio', '[RATIO]'], ['Free speed', '[FT/S]'], ['Wheel dia.', '[IN]'],
          ['Motors', '[MODEL]'], ['Current limit', '[AMPS]'] ] },
        note: 'measure the real speed, do not trust the calculator' },

      { label: 'Camera',
        title: 'Camera and Vision',
        lede: 'One camera, mounted where it can see the target and nothing else.',
        body: `
          <h3>Hardware</h3>
          <p><span class="ph">[CAMERA MODEL]</span> on a <span class="ph">[MOUNT MATERIAL]</span> bracket, angled <span class="ph">[ANGLE]</span> degrees up from horizontal and <span class="ph">[HEIGHT]</span> off the floor.</p>
          <p>The mount is rigid on purpose. A camera that flexes under acceleration gives you a calibration that is only true when the robot is standing still.</p>
          <h3>Pipeline</h3>
          <p>Running <span class="ph">[SOFTWARE — PhotonVision / Limelight]</span>. Targets are filtered by area and aspect ratio before anything is passed to the drive code, so a reflection off the glass does not become a target.</p>
          <h3>Calibration</h3>
          <p>Re-calibrate after any crash that touches the mount, and once on arrival at every event — venue lighting is never the same as the shop.</p>`,
        aside: { title: 'Setup', facts: [
          ['Model', '[CAMERA]'], ['Resolution', '[W × H]'], ['FPS', '[RATE]'],
          ['Mount height', '[IN]'], ['Pipeline', '[NAME]'] ] },
        note: 'photograph the mount before you take it apart' },

      { label: 'Electrical',
        title: 'Electrical',
        lede: 'Power, protection, and the wiring nobody wants to trace at 2am in the pit.',
        body: `
          <h3>Power path</h3>
          <p><span class="ph">[BATTERY SPEC]</span> into the main breaker, then the PDP. Every drive motor on its own <span class="ph">[AMPS]</span> breaker; low-current devices share the small channels.</p>
          <h3>Wiring rules we hold to</h3>
          <p>Colour is not optional — red positive, black negative, no exceptions. Every run is labelled at both ends. Nothing crosses a moving joint without a strain relief.</p>
          <p>Signal wire is routed away from motor leads wherever it can be. Where it cannot, it crosses at right angles rather than running alongside.</p>
          <h3>Pit checks</h3>
          <ul class="log">
            <li><time>Every match</time><p>Battery voltage under load, main breaker seated, no loose Anderson connectors.</p></li>
            <li><time>Every day</time><p>Full tug test on the PDP and motor terminals.</p></li>
          </ul>`,
        aside: { title: 'Ratings', facts: [
          ['Battery', '[SPEC]'], ['Main breaker', '[AMPS]'],
          ['Drive breakers', '[AMPS]'], ['Wire gauge', '[AWG]'] ] },
        note: 'label both ends or you will regret it' }

    ] },

  { id: 'awards', n: '05', title: 'Awards', look: 'v-lined',
    dek: 'What the judges wrote down.',
    meta: 'Season record',
    x: 322, y: 566, w: 244, h: 236, rot: 2.6,
    links: ['contact', 'team'],
    extra: `<p class="scribble">…and the ones we<br>are still chasing.</p>`,
    lede: 'The judged results, in the order they happened.',
    body: `
      <h3>Season results</h3>
      <ul class="log">
        <li><time>[YEAR]</time><p><b>[AWARD NAME]</b> — <span class="ph">[EVENT]</span>. <span class="ph">[ONE LINE ON WHY]</span></p></li>
        <li><time>[YEAR]</time><p><b>[AWARD NAME]</b> — <span class="ph">[EVENT]</span>. <span class="ph">[ONE LINE ON WHY]</span></p></li>
        <li><time>[YEAR]</time><p><b>[AWARD NAME]</b> — <span class="ph">[EVENT]</span>. <span class="ph">[ONE LINE ON WHY]</span></p></li>
      </ul>
      <h3>Competition record</h3>
      <p>Qualification and playoff results by event, with rank and record: <span class="ph">[EVENT — RANK — W/L/T]</span>.</p>`,
    aside: { title: 'At a glance', facts: [
      ['Awards', '[COUNT]'], ['Events', '[COUNT]'], ['Best finish', '[RESULT]'],
      ['Seasons run', '[COUNT]'] ] },
    note: 'judges read these pages too — keep it factual' },

  { id: 'outreach', n: '06', title: 'Outreach', look: '',
    dek: 'Workshops, demos, and the kids who keep showing up on Saturdays.',
    meta: 'Hours · Events · Partners',
    x: 652, y: 596, w: 254, h: 206, rot: -3,
    links: ['awards', 'sponsors'],
    lede: 'The part of the season that does not fit in a crate.',
    body: `
      <h3>What we run</h3>
      <p><b>Workshops.</b> Hands-on sessions for <span class="ph">[AGE GROUP]</span> at <span class="ph">[PARTNER SCHOOL / LIBRARY]</span> — wiring, basic programming, and driving the practice robot.</p>
      <p><b>Demos.</b> We bring the robot to <span class="ph">[EVENT NAMES]</span>. If your event wants one, ask early; the robot is in a crate for part of the year.</p>
      <p><b>Mentoring.</b> Our students mentor <span class="ph">[JUNIOR PROGRAM / TEAM]</span> through their build season.</p>
      <h3>Want us there?</h3>
      <p>Send the date, the audience and the space you have to <span class="ph">[OUTREACH EMAIL]</span>. We will tell you honestly whether we can staff it.</p>`,
    aside: { title: 'Last season', facts: [
      ['Events', '[COUNT]'], ['Students reached', '[COUNT]'],
      ['Volunteer hours', '[COUNT]'], ['Partners', '[COUNT]'] ] },
    note: 'real numbers here carry more weight than adjectives' },

  { id: 'sponsors', n: '07', title: 'Sponsors', look: 'v-manila',
    dek: 'The people who turn a parts list into a robot.',
    meta: 'Tiers · How to join',
    x: 996, y: 648, w: 262, h: 192, rot: 1.9,
    links: [],
    lede: 'A season costs roughly <span class="ph">[SEASON BUDGET]</span>. Here is where it goes and how to help.',
    body: `
      <h3>Support tiers</h3>
      <ul class="tierlist">
        <li><b>[TIER NAME] · [AMOUNT]</b><span>Logo on the robot and this board</span></li>
        <li><b>[TIER NAME] · [AMOUNT]</b><span>Logo on team shirts and pit banner</span></li>
        <li><b>[TIER NAME] · [AMOUNT]</b><span>Named on the site and season materials</span></li>
        <li><b>In kind</b><span>Materials, machine time, mentoring</span></li>
      </ul>
      <h3>Where it goes</h3>
      <p>Registration and event fees, raw stock and parts, tooling, safety equipment, and travel. We publish a season budget summary to every sponsor at the end of the year.</p>
      <p>To sponsor, or to ask what we actually need this season, write to <span class="ph">[SPONSOR EMAIL]</span>.</p>`,
    aside: { title: 'Current supporters', facts: [
      ['[SPONSOR NAME]', '[TIER]'], ['[SPONSOR NAME]', '[TIER]'],
      ['[SPONSOR NAME]', '[TIER]'], ['[SPONSOR NAME]', '[TIER]'] ] },
    note: 'logos drop in here once you have the files' },

  { id: 'contact', n: '08', title: 'Contact', look: 'v-sticky',
    dek: 'Where we meet, and how to reach a mentor.',
    x: 120, y: 640, w: 176, h: 158, rot: -5,
    links: [],
    lede: 'Students, parents, mentors, sponsors — all four go to different places.',
    body: `
      <h3>Reach us</h3>
      <ul class="tierlist">
        <li><b>General</b><span>[TEAM EMAIL]</span></li>
        <li><b>Sponsorship</b><span>[SPONSOR EMAIL]</span></li>
        <li><b>Outreach bookings</b><span>[OUTREACH EMAIL]</span></li>
        <li><b>Lead mentor</b><span>[NAME — EMAIL]</span></li>
      </ul>
      <h3>Find us</h3>
      <p>We meet at <span class="ph">[SHOP ADDRESS]</span> on <span class="ph">[DAYS AND TIMES]</span>. Visitors are welcome; email first so someone is expecting you.</p>
      <p>Online: <span class="ph">[INSTAGRAM]</span> · <span class="ph">[YOUTUBE]</span> · <span class="ph">[GITHUB]</span></p>`,
    aside: { title: 'Joining', facts: [
      ['Open to', '[GRADES]'], ['Sign-up opens', '[MONTH]'],
      ['Experience', 'None needed'], ['Cost', '[FEE / NONE]'] ] },
    note: 'this note is the one people actually read — keep it current' }

];
