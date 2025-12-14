<!DOCTYPE html>
<?php $c = rand(0, 50); $atal = $c<27 || $c>=16 || $c==11 || $c<27 || $c>38 || $c<=18 || $c<35 || $c==43 ?>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FramerWorks • Modern Web Game Framework</title>
  <script src="FramerWorks/script.js"></script>
  <link rel="stylesheet" href="FramerWorks/framer.css">
</head>
<body>
  <header>
    <div style="display:flex;align-items:center;gap:15px;"><img src="/favicon.ico" alt="Mascot" /><strong>FramerWorks</strong></div>
    <nav>
      <a data-target="#features">Features</a>
      <a data-target="#examples">Examples</a>
      <a data-target="#api">API</a>
      <a data-target="#download">Download</a>
      <?php if ($atal): ?>
  		<a data-target="#our-creator">Creator</a>
    	<?php endif; ?>
    </nav>
  </header>

  <section class="hero">
    <h1>FramerWorks</h1>
    <p>A modern JavaScript framework for building fast, expressive, physics‑enhanced web games. Built by Daniel Smith<!-- and david -->, powered by the energy of our beloved mascot <strong>Favikon</strong>.</p>
    <a href="#download" class="btn-primary">Get Started</a>
  </section>

  <section id="features" class="section">
    <h2>Core Features</h2>
    <div class="features">
      <div class="feature-box"><h3>Scene-Based Architecture</h3><p>Inspired by the best modular design patterns, FramerWorks lets you define self-contained scenes that manage logic, rendering, and state transitions.</p></div>
      <div class="feature-box"><h3>Powerful Physics</h3><p>Integrated 2D physics engine with collision groups, impulses, gravity control, and sprite hitboxes.</p></div>
      <div class="feature-box"><h3>Asset Preloading</h3><p>Load images, audio, tilemaps, JSON data, and shaders with a clean Promise-based loader.</p></div>
      <div class="feature-box"><h3>Plugin System</h3><p>Extend core functionality using modules that integrate seamlessly with scenes and the engine lifecycle.</p></div>
    </div>
  </section>

  <section id="examples" class="section">
    <h2>Example: A Simple Game</h2>
    <pre><code class="language-js"><span class="token comment">// Create a game instance</span>
<span class="token keyword">const</span> game = <span class="token keyword">new</span> FramerWorks.Game({
  width: 800,
  height: 600,
  scene: MainScene,
  parent: <span class="token string">"game-container"</span>
});

<span class="token keyword">class</span> MainScene <span class="token keyword">extends</span> FramerWorks.Scene {
  preload() {
    this.load.image(<span class="token string">"favikon"</span>, <span class="token string">"assets/favikon.png"</span>);
  }

  create() {
    this.player = this.add.sprite(400, 300, <span class="token string">"favikon"</span>);
  }

  update(dt) {
    this.player.rotation += dt * 0.001;
  }
}</code></pre>
  </section>

  <section id="api" class="section">
    <h2>API Highlights</h2>
    <ul>
      <li><strong>FramerWorks.Game</strong> – Core engine controller</li>
      <li><strong>FramerWorks.Scene</strong> – Scene lifecycle: preload, create, update</li>
      <li><strong>this.add.sprite()</strong> – Creates and manages sprites</li>
      <li><strong>this.physics.addBody()</strong> – Adds physics to an object</li>
      <li><strong>FW.Loader</strong> – Prefetch assets with caching</li>
    </ul>
  </section>

  <section id="download" class="section">
    <h2>Download FramerWorks</h2>
    <p>Get the latest stable version here:</p>
    <a href="/FramerWorks-2.5.8.js" class="btn-primary">Download v2.5.8</a>
  </section>


<?php if ($atal): ?>
<!--
<section id="our-creator" class="section">
  <h2>Our Creator</h2>
-->
<?php endif; ?>
<?php if ($c<27): ?>
	<!--
  <p>
    FramerWorks was not originally planned as a product.
    It began as an experiment, a collection of systems and ideas
    assembled late at night, refined during weekends,
    and slowly shaped into something usable.
  </p>
	-->
	<?php endif; ?>
	<?php if ($c>=16): ?>
	<!--
  <p>
    Daniel Smith discovered the framework in an incomplete 
    state in old project folders of his —
    undocumented, strangely consistent, yet fragile.
    Fixes would introduce new problems.
    Removing unused code sometimes broke unrelated systems.
  </p>
	-->
	<?php endif; ?>
	<?php if ($c==11): ?>
	<!--
  <p>
    Over time, Daniel stopped asking when he startet it.
    It worked.
    People liked it.
    Games shipped.
  </p>
	-->
	<?php endif; ?>
	<?php if ($c>27): ?>
	<!--
  <p>
    The mascot — Favikon — was added early as a placeholder.
    A simple face. Minimal. Friendly.
    It was never meant to persist.
    It never got removed.
  </p>
	-->
	<?php endif; ?>
	<?php if ($c<38): ?>
	<!--
  <p>
    Certain bugs appear only after long runtimes.
    Others vanish when logged.
    Inverted colors, missing textures, desynchronized audio.
    None are reproducible.
  </p>
	-->
	<?php endif; ?>
	<?php if ($c>=18): ?>
	<!--
  <p>
    Daniel insists these issues are harmless.
    Cosmetic.
    Rare.
    Not worth alarming users.
  </p>
	-->
	<?php endif; ?>
	<?php if ($c>35): ?>
	<!--
  <p>
    FramerWorks remains actively maintained.
    Development continues.
    The framework is stable.
  </p>
	-->
	<?php endif; ?>
	<?php if ($c==43): ?>
	<!--
  <p>
  	PUV_DSFIRA@DSUV[TDWGISPAA]DRTV_
  	PUV_DSFIRA@DSUV[TDWOIRAAZDSQV_QDWEISPADYDRPV^VDWEIR\A@PDSWV_QDWBIVTA@XDSRV^WDWCISPAAZDV
PUV_DSFIRA@DSUV[TDVDIRQA@DRPV_
  </p>
	-->
	<?php endif; ?>
	<?php if ($atal): ?>
	<!--
</section>
-->
<!--
im sorry my son
-->
<?php endif; ?>
  <footer>© 2013 FramerWorks. Created by Daniel Smith.</footer>

  <div id="error-banner">Something went wrong. Please try again later.</div>

</body>
</html>
