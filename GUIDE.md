# De TECH tive — Evidence Board

## The manual

Everything you need to run, change and extend the site. Nothing here
assumes you have built a website before.

---

## 1. What is in the folder

| File | What it is | Do you edit it? |
|---|---|---|
| `index.html` | The shell. Loads the other three files. | Almost never |
| `content.js` | **Every paper, every case page, every string.** | Yes — this is the one |
| `style.css` | All the styling, with the lighting knobs at the top. | Yes — for looks |
| `board.js` | The engine: placement, string curves, page switching, scaling. | Rarely |
| `GUIDE.txt` | **This same manual as plain text — double-click it and it opens in Notepad.** Use that one if you are on Windows. | — |
| `GUIDE.md` | This file. The manual formatted for GitHub. | — |

The rule of thumb: **what the site says** lives in `content.js`, **what
the site looks like** lives in `style.css`, and `board.js` is the part
that does the work. You can go a long way without opening `board.js`.

---

## 2. Opening it and putting it online

**To look at it:** double-click `index.html`. It opens in your browser.
That is it — no install, no build step, no server.

**To put it online:** upload all four files (`index.html`, `content.js`,
`style.css`, `board.js`) to any static host, keeping them in the same
folder. GitHub Pages, Netlify drop, Cloudflare Pages, your school's web
space — all work. There is no backend and no database.

**Editing:** open the files in any plain-text editor. VS Code, Notepad++,
Sublime, even Notepad. Save, then refresh the browser.

> If a change does not seem to show up, hard-refresh: **Ctrl+Shift+R**
> (Windows) or **Cmd+Shift+R** (Mac). Browsers cache CSS and JS.

---

## 3. Adding a paper

Every paper on the board is one block in the `PAPERS` list in
`content.js`. Adding one gets you, automatically:

- a paper pinned to the board, with a thumbtack
- red string to whatever you tie it to
- the hover effect (corner brackets, lit strings, everything else dims)
- its own full case-file page
- a spot on the board, if you do not pick one yourself

**Copy this block, paste it into `PAPERS` before the closing `];`, and
change the words.** Mind the comma after the previous block's `}`.

```js
  { id: 'shop', n: '09', title: 'The Shop', look: 'v-graph',
    dek: 'Twelve hundred square feet and one working vice.',
    meta: 'Tools · Safety · Hours',
    links: ['robot', 'contact'],
    lede: 'Where the noise comes from.',
    body: `
      <h3>What is in there</h3>
      <p>A mill, a lathe, two printers and a router that is older than
         anyone on the team.</p>
      <h3>Safety</h3>
      <p>Eye protection at all times. No solo machining, ever.</p>`,
    aside: { title: 'Kit', facts: [
      ['Mill', '[MODEL]'],
      ['Lathe', '[MODEL]'],
      ['Printers', '[COUNT]'] ] },
    note: 'update this when the new router lands' },
```

Save, refresh. Done.

### Every field, explained

| Field | Required | What it does |
|---|---|---|
| `id` | **yes** | Short unique name. Letters, numbers and dashes only. Becomes the page's web address (`#shop`) and how other papers point string at it. |
| `n` | no | The case number printed on the paper and its page. Skip it and the paper just has no number. |
| `title` | **yes** | Heading on the paper and at the top of its page. |
| `dek` | no | One line under the title on the paper. |
| `meta` | no | Small caps strip along the bottom of the paper. |
| `look` | no | Which paper stock. See §7. |
| `x`, `y` | no | Where it sits on the 1440 × 980 board. Leave them out and it places itself. |
| `w`, `h` | no | Size of the paper. Defaults to 256 × 206. |
| `rot` | no | Tilt in degrees. Negative leans left. Leave out and it picks one. |
| `links` | no | List of other `id`s to run red string to. `[]` means none. |
| `lede` | no | The italic opening line on its page. |
| `body` | **yes** | The page itself, written as HTML. See §9. |
| `aside` | no | The boxed fact list on the right of the page. |
| `note` | no | Handwritten note in the page margin. |
| `extra` | no | Extra HTML on the paper front, under the dek — a sketch, a scribble. |
| `face` | no | Replaces the entire paper front. Only needed for unusual papers like the photo card. |

### Two things that will bite you

1. **Commas.** Every block except the last needs a `,` after its
   closing `}`. Miss one and the board goes blank.
2. **Backticks.** `body` is wrapped in backticks `` ` `` — not quotes.
   That is what lets it run over many lines. If your text contains a
   backtick, write `` \` ``.

If the board comes up blank, see §12.

---

## 4. Removing a paper

Delete its whole `{ ... }` block from `PAPERS`, including the comma.

That is the only step. You do **not** need to:

- remove the strings pointing at it — they vanish with it, because
  string is worked out from `links` at load time, not written by hand
- delete its page — the page is generated from the block
- renumber anything — though you will probably want to fix the `n`
  values so the case numbers still run in order

The one thing to check: if another paper's `body` has a hand-written
link to it, like `<a href="#shop">the shop</a>`, that link now goes
nowhere and lands you back on the board. Search `content.js` for the
id you deleted.

---

## 5. Moving, resizing, tilting

The board is a fixed canvas **1440 wide by 980 tall**. `x` and `y` are
measured from the top-left corner, in those units, and they point at
the paper's own top-left corner.

```js
x: 826, y: 176,     // 826 across, 176 down
w: 286, h: 202,     // 286 wide, 202 tall
rot: -1.8           // leaning slightly left
```

**Delete `x` and `y`** and the paper places itself: the engine scores
every spot on the board by how much it would overlap the papers already
placed (and the masthead and the handwritten legend, which count as
obstacles), and takes the emptiest one. If the board is crowded it
retries the paper at 86%, 74%, 62% and 52% size until something fits
cleanly — so extra papers arrive as smaller notes rather than landing
on top of each other.

About **ten papers** fit comfortably. Past that you will see this in the
browser console:

```
Evidence board: "shop" had no clear space left — give it its own x / y.
```

That means: pick a spot yourself, or give it a smaller `w` / `h`, or
retire a paper you no longer need.

**Want a bigger board?** Change `BOARD_W` and `BOARD_H` at the top of
`board.js` **and** `--board-w` / `--board-h` in `style.css` to the same
numbers. They must match.

---

## 6. Restringing

Each paper carries its own connections in `links`:

```js
{ id: 'robot', ..., links: ['wheels', 'sponsors'] }
```

That draws string from The Robot to Wheels Assembly and to Sponsors.

- String is **two-way**. Listing `robot` in `wheels` as well changes
  nothing — duplicates are dropped.
- Pointing at an id that does not exist is ignored, silently and
  safely.
- `links: []` or no `links` at all means an unconnected paper. That is
  allowed; it just floats.
- String hangs in a curve, sagging under its own weight. Long runs sag
  more. Near-vertical runs bow sideways instead. That is all worked out
  from the two pin positions — nothing to set.

### String in front of, or behind, the papers

Out of the box the string runs **across the front** of the papers, with
each end tucking under the head of its pin — the way it does on a real
board. That is two numbers in `style.css`, sitting next to each other:

```css
.strings{ … z-index:4 … }     /* string in front */
.paper{ … z-index:auto … }    /* papers behind it */
```

To put the string **behind** the papers instead:

```css
.strings{ … z-index:2 … }
.paper{ … z-index:3 … }
```

Nothing else changes, and `content.js` is not involved.

`z-index:auto` on the paper is the part that matters: give the paper a
number of its own and it traps its pin underneath it, so the string
draws over the top of the pin head instead of ending at it.

**Hovering a paper lights up its string.** That comes free: every paper
gets a rule generated for it at load, so a new paper's string lights up
the same as the originals.

---

## 7. Paper stocks (`look`)

| `look` | What you get |
|---|---|
| `''` (or leave it out) | Plain off-white sheet |
| `'v-manila'` | Buff manila card with a darker strip along the top |
| `'v-lined'` | Ruled notepad, blue lines, red margin |
| `'v-graph'` | Graph paper |
| `'v-photo'` | Polaroid — white frame, photo well, handwritten caption |
| `'v-sticky'` | Yellow sticky note |

### Making your own stock

In `style.css`, find the block headed `paper looks`. Copy one and rename
it:

```css
.v-blueprint .sheet{
  background:
    repeating-linear-gradient(0deg,transparent 0 18px,rgba(255,255,255,.16) 18px 19px),
    repeating-linear-gradient(90deg,transparent 0 18px,rgba(255,255,255,.16) 18px 19px),
    linear-gradient(158deg,#1e3f6b,#12294a);
  color:#e8f0ff;
}
.v-blueprint .ptitle,
.v-blueprint .pdek{color:#e8f0ff}
```

Then use it: `look: 'v-blueprint'`.

The only rule is that the class targets `.sheet` (the visible paper),
not `.paper` (the invisible positioned box around it).

---

## 8. Photos and images

Put your image file in the same folder as `index.html`.

**Inside a case page**, in `body`:

```html
<img src="team-2026.jpg" alt="The team at the district event">
```

**Replacing the polaroid placeholder** on the Team paper — swap the
`face` field for:

```js
face: `
  <div class="photo-frame"><img src="team-2026.jpg" alt="Team photo"></div>
  <div class="photo-cap">the crew — 2026</div>`,
```

The photo well crops to fill, so any aspect ratio works.

**Keep files small.** Resize photos to about 1200px on the long edge and
save as JPG. A 6MB phone photo will make the page crawl on a school
wifi connection.

---

## 9. Writing a case page (`body`)

`body` is plain HTML. These are the pieces already styled for you — use
them and the page stays consistent.

**Headings and text**

```html
<h3>A section heading</h3>
<p>A paragraph. <b>Bold</b> and <i>italic</i> work as normal.</p>
```

**A placeholder you have not filled in yet** — shows as a boxed red tag
so nobody mistakes it for a real fact:

```html
<span class="ph">[TEAM NUMBER]</span>
```

**A dated log** — build logs, award history, season timelines:

```html
<ul class="log">
  <li><time>14 Jan</time><p>Cut the first plate.</p></li>
  <li><time>21 Jan</time><p>Drivetrain rolling under its own power.</p></li>
</ul>
```

**A roster** — names, roles, two columns:

```html
<ul class="roster">
  <li><b>Sam Ortiz</b><span>Build lead</span></li>
  <li><b>Priya Raman</b><span>Software lead</span></li>
</ul>
```

**A tier or contact list** — label on the left, value on the right:

```html
<ul class="tierlist">
  <li><b>Gold · $2,500</b><span>Logo on the robot</span></li>
  <li><b>General enquiries</b><span>team@example.org</span></li>
</ul>
```

**A link to another case file** — use the paper's `id` with a `#`:

```html
<a href="#wheels">the build log</a>
```

**The fact box** on the right is not HTML, it is the `aside` field:

```js
aside: { title: 'Spec sheet', facts: [
  ['Weight', '120 lb'],
  ['Top speed', '14 ft/s'] ] },
```

---

## 9b. Folder tabs on a case page

A case page can carry a row of real folder tabs across the top of its
manila folder. Case 04, Wheels Assembly, has four: **Wheels Assembly**,
**Drivetrain**, **Camera** and **Electrical**. Hovering one lifts it
clear of the folder with a thin white outline and a soft white glow;
clicking slides the new contents in from the right. Hidden radio
buttons and CSS do all of it — no JavaScript.

Replace that paper's `lede` / `body` / `aside` / `note` with a `tabs`
list. Each entry takes the same fields the page used to take:

```js
tabs: [
  { label: 'Wheels Assembly',
    title: 'Wheels Assembly',
    lede: 'The wheel-module build log.',
    body: `<h3>Log</h3><p>…</p>`,
    aside: { title: 'Bill of materials', facts: [['Wheels', '[PART #]']] },
    note: 'keep adding entries' },

  { label: 'Drivetrain', title: 'Drivetrain',
    body: `<h3>Layout</h3><p>…</p>` },

  { label: 'Camera', title: 'Camera and Vision',
    body: `<p>…</p>` }
]
```

| Tab field | Required | What it does |
|---|---|---|
| `label` | **yes** | Text on the tab itself. One or two words. |
| `title` | no | Big heading inside the folder. Falls back to `label`. |
| `lede` | no | Italic opening line for that tab. |
| `body` | **yes** | That tab's contents, as HTML. Same as §9. |
| `aside` | no | Its own boxed fact list. |
| `note` | no | Its own handwritten margin note. |

- **Add a tab:** copy a block into the list. It gets its own tab, hover,
  slide-in and panel automatically.
- **Remove a tab:** delete its block. Drop to one and the strip
  disappears — the page goes back to an ordinary case file.
- **Which tab opens:** whichever block is first. Move a block to the top
  to change it.
- **A paper without tabs** is untouched: keep `lede` / `body` / `aside` /
  `note` where they are.

Slide speed lives in `board.js` (search `panel-in`, the `.34s`); the
distance it travels from is the `@keyframes panel-in` block in
`style.css`. The hover lift and white glow are `.ftab:hover`.

### The file opening

Clicking a paper on the board plays an opening: the file tips down and
forward as though a cover were lifted. Every case file does this, tabs
or not. In `style.css`, search `file-open`:

```css
.case .filewrap{animation:file-open .52s …}   /* how long it takes */

@keyframes file-open{
  0%{opacity:0; transform:translateY(38px) rotateX(-24deg) scale(.955)}
}                       /* rotateX is the tilt it opens from; 0deg = off */
```

On phones the tilt is dropped and the opening becomes a plain rise.

---

## 10. Lighting

The board is lit like a room with a single lamp hanging over it. All of
it is controlled by the block at the very top of `style.css`.

| Knob | What it does | Range |
|---|---|---|
| `--board-light` | The cork where the lamp hits it | any colour |
| `--board-mid` | The middle of the board | any colour |
| `--board-dark` | The bottom corners, furthest from the lamp | any colour |
| `--lamp` | Colour and strength of the lamp pool | last number is the strength, `0`–`1` |
| `--lamp-x`, `--lamp-y` | Where the lamp hangs | `0%`–`100%` |
| `--lamp-size` | How wide the pool spreads | two percentages, width then height |
| `--vignette` | How dark the corners go | `0` = off, `.5` = heavy |
| `--grain` | Film grain over everything | `0` = off, `.4` = heavy |
| `--cork` | Blotchy cork mottling | `0` = off, `.5` = heavy |
| `--dim` | How far unlit papers fade when you hover one | `1` = no fade, `.4` = strong |

### Three settings to start from

**Bright — daylight through a window.** Good if people are reading this
on phones or projectors.

```css
--board-light:#b08a56;
--board-mid:#96703d;
--board-dark:#6b502c;
--lamp:rgba(255,246,220,.55);
--vignette:.12;
--grain:.16;
--cork:.20;
--dim:.86;
```

**Standard — what ships.** One lamp, warm, corners falling away.

```css
--board-light:#88683f;
--board-mid:#6a4e29;
--board-dark:#44321c;
--lamp:rgba(255,238,198,.48);
--vignette:.30;
--grain:.24;
--cork:.28;
--dim:.74;
```

**Hard noir — one bulb, late.** Dramatic, harder to read.

```css
--board-light:#5a4326;
--board-mid:#3f2e19;
--board-dark:#241a0e;
--lamp:rgba(255,226,168,.42);
--vignette:.52;
--grain:.32;
--cork:.34;
--dim:.45;
```

### Moving the lamp

`--lamp-x: 44%` and `--lamp-y: 4%` hang it near the top, slightly left
of centre. Try `--lamp-x: 70%` to throw the light across the right of
the board, or `--lamp-y: 40%` to drop it lower and light the middle.
`--lamp-size: 66% 56%` is the spread — bigger numbers, softer and wider.

### Changing the accent colour

Red string, red thumbtacks, red case numbers and the red hover brackets
all come from three variables:

```css
--red:#b8321f;       /* the string, the tacks, case numbers */
--red-deep:#7d1c10;  /* hovered links, section headings */
--red-hot:#ff5c38;   /* the string when you hover a paper */
```

Change all three together or the hover will not match.

### Type

Three fonts, loaded from Google Fonts in `index.html`:

```css
--type:"Special Elite", ...   /* typewriter — headings, labels, stamps */
--serif:"Libre Baskerville", ...  /* reading copy */
--hand:"Caveat", ...          /* handwritten notes and captions */
```

To swap one, change the `<link>` in `index.html` to the new font and
update the variable. Always keep the fallbacks after the comma so text
still shows if Google Fonts is blocked on a school network.

---

## 11. Scaling — how it works on different devices

Two modes, chosen automatically on load and on every resize, rotate,
fullscreen toggle and display change.

**Canvas mode** — screens 1024px wide and up, and at least 620px tall.

The cork fills the entire screen, whatever shape the screen is: a 16:9
television, a 21:9 ultrawide, a square-ish laptop. On top of it the
board sits at a fixed 1440 × 980, scaled to the largest size that still
shows all of it, and centred. So you never get black letterbox bars —
just more corkboard around the edges on wider screens.

Everything is real text and vector shapes, so it stays sharp at any
size. A 13" laptop draws it at about 0.7×; a 1080p television at about
1.06×; a 4K television at about 2.1×. Nothing is ever cropped and there
is never anything to scroll.

**Stacked mode** — anything narrower or shorter. The pinned board turns
into a normal scrolling page: the papers become a responsive grid of
cards (two or three across on a tablet, one on a phone), each keeping
its own thumbtack and stock, and the red string steps aside since it has
nothing to connect across a scrolling column. Case pages become a
single readable column with the sidebar dropping below the text.

Both are in `style.css`. Stacked rules all start with
`:root[data-mode="stack"]`, so you can find every one of them by
searching for that. Canvas mode is everything else.

### Putting it on a television

It is built for this. Open `index.html` in the TV's browser (or on a
stick / mini PC plugged into it), press **F11** for fullscreen, and
leave it. It will fill the screen correctly at 720p, 1080p, 1440p and
4K without you changing anything.

Points worth knowing:

- **Overscan.** Many televisions quietly crop 2–4% off every edge. The
  board leaves a small margin for that, set by `SAFE_AREA` in
  `board.js`. If your screen shows the full picture (most modern sets,
  and every monitor), set it to `1` and the board grows to fill more of
  the screen.
- **Kiosk mode.** To have it come up fullscreen on boot with no browser
  chrome, launch Chrome with
  `chrome --kiosk "file:///path/to/index.html"`.
- **Sleep and wake.** When a TV or set-top box changes resolution or
  wakes up, the board re-measures itself and re-fits. You do not have
  to refresh it.
- **Reading distance.** At 1080p the case-page body type lands around
  15px × 1.06 — comfortable from a desk, small from across a room. If
  the board lives on a wall people read from a distance, raise the type
  in `style.css`: `.fbody p{font-size:16.5px}` and
  `.pdek{font-size:13px}`.

### The three numbers that control all of it

In `board.js`:

```js
var STACK_BELOW_W = 1024;  // narrower than this → stacked layout
var STACK_BELOW_H = 620;   // shorter than this  → stacked layout
var MAX_SCALE     = 8;     // ceiling on how large it may draw
var SAFE_AREA     = 0.96;  // margin kept for TV overscan. 1 = none
```

Raise `STACK_BELOW_W` to send tablets to the stacked layout too; lower
it to keep the pinned board on smaller screens. `MAX_SCALE` of 8 is
high enough for an 8K wall and is simply never reached on a laptop.

### Cards per row on tablets

In `style.css`:

```css
:root[data-mode="stack"] .papers{
  grid-template-columns:repeat(auto-fill,minmax(272px,1fr));
}
```

`272px` is the narrowest a card may get before the grid drops to fewer
columns. Raise it for wider cards, lower it for more per row.

---

## 12. When something breaks

**The board comes up blank.** Almost always a typo in `content.js`.
Open the browser console — **F12**, then the *Console* tab — and read
the first red line. The usual causes:

- a missing comma between two `{ ... }` blocks
- a missing closing backtick on a `body`
- an unclosed HTML tag inside `body`

**A paper is missing.** Check it has an `id` and that the id is not the
same as another paper's.

**A paper is sitting on top of another.** The board is full. Give it
`x` / `y`, shrink its `w` / `h`, or remove something.

**A string does not appear.** The id in `links` does not match a real
paper's `id`. They are case-sensitive: `Robot` is not `robot`.

**Clicking a paper does nothing.** Its `id` has a character that is not
a letter, number or dash. Spaces and slashes break the address.

**The fonts look wrong.** Google Fonts is blocked or offline; the page
falls back to system fonts and stays readable. Nothing is broken.

**Changes are not showing.** Hard-refresh: Ctrl+Shift+R / Cmd+Shift+R.

---

## 13. Quick reference — where to change what

| I want to… | File | Where |
|---|---|---|
| Add or remove a page | `content.js` | The `PAPERS` list |
| Change the team name or tagline | `content.js` | The `TEAM` block at the top |
| Rewrite a page | `content.js` | That paper's `body` |
| Move a paper | `content.js` | Its `x` / `y` |
| Change what string connects | `content.js` | Its `links` |
| Make the board lighter or darker | `style.css` | The lighting block at the top |
| Change the red | `style.css` | `--red`, `--red-deep`, `--red-hot` |
| Change the fonts | `style.css` + `index.html` | `--type` / `--serif` / `--hand`, and the `<link>` |
| Invent a new paper stock | `style.css` | The `paper looks` section |
| Change how it behaves on phones | `style.css` | The `:root[data-mode="stack"]` rules |
| Change the phone/desktop cutoff | `board.js` | `STACK_BELOW_W` |
| Fill more of a TV screen | `board.js` | `SAFE_AREA` — set it to `1` |
| Resize the whole board | `board.js` + `style.css` | `BOARD_W` / `BOARD_H` and `--board-w` / `--board-h` |
