<script setup lang="ts">
const { size = 36, label = '' } = defineProps<{
  /** Height of the switch in px (width is twice this). */
  size?: number
  /** Optional visible label; also used as the accessible name. */
  label?: string
}>()

/** `true` = night (moon), `false` = day (sun). */
const night = defineModel<boolean>({ default: false })

const stars = [
  { x: 14, y: 20, s: 2.5, d: 0 },
  { x: 30, y: 62, s: 2, d: 0.8 },
  { x: 44, y: 28, s: 3, d: 0.3 },
  { x: 58, y: 70, s: 2, d: 1.4 },
  { x: 24, y: 40, s: 1.5, d: 1.1 },
  { x: 52, y: 48, s: 1.8, d: 0.5 },
]

function toggle() {
  night.value = !night.value
}
</script>

<template>
  <label class="dn" :class="{ 'is-night': night }" :style="{ fontSize: size + 'px' }">
    <button
      type="button"
      class="dn__switch"
      role="switch"
      :aria-checked="night"
      :aria-label="label || 'Dark mode'"
      @click="toggle"
    >
      <span class="dn__sky" aria-hidden="true">
        <span
          v-for="(st, i) in stars"
          :key="i"
          class="dn__star"
          :style="{
            left: st.x + '%',
            top: st.y + '%',
            width: st.s + 'px',
            height: st.s + 'px',
            animationDelay: st.d + 's',
          }"
        />
        <span class="dn__cloud dn__cloud--a" />
        <span class="dn__cloud dn__cloud--b" />
        <span class="dn__cloud dn__cloud--c" />
      </span>
      <span class="dn__knob" aria-hidden="true">
        <span class="dn__crater dn__crater--a" />
        <span class="dn__crater dn__crater--b" />
        <span class="dn__crater dn__crater--c" />
      </span>
    </button>
    <span v-if="label" class="dn__label" aria-hidden="true">{{ label }}</span>
  </label>
</template>

<style scoped>
.dn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  cursor: pointer;
  /* font-size is the sizing unit: 1em = switch height */
}

.dn__label {
  font:
    500 max(14px, 0.4em) system-ui,
    sans-serif;
  color: inherit;
}

.dn__switch {
  font-size: inherit;
  position: relative;
  width: 2em;
  height: 1em;
  padding: 0;
  border: 0;
  border-radius: 1em;
  overflow: hidden;
  cursor: pointer;
  background: #4aa8ff;
  box-shadow:
    inset 0 0.04em 0.1em rgba(0, 0, 0, 0.35),
    0 0 0 0.03em rgba(255, 255, 255, 0.15);
  transition: background 0.6s ease;
  -webkit-tap-highlight-color: transparent;
}

.dn__switch:focus-visible {
  outline: 3px solid #fff;
  outline-offset: 3px;
  box-shadow: 0 0 0 6px #7c3aed;
}

.is-night .dn__switch {
  background: #121a3d;
}

.dn__sky {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #2f8fff 0%, #8fd0ff 100%);
  transition: opacity 0.6s ease;
}

.dn__sky::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #060a22 0%, #1d2a63 100%);
  opacity: 0;
  transition: opacity 0.6s ease;
}

.is-night .dn__sky::before {
  opacity: 1;
}

.dn__star {
  position: absolute;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 4px #fff;
  opacity: 0;
  transform: translateY(-0.3em) scale(0.2);
  transition:
    opacity 0.5s ease 0.15s,
    transform 0.6s cubic-bezier(0.3, 1.5, 0.5, 1) 0.15s;
}

.is-night .dn__star {
  opacity: 1;
  transform: none;
  animation: dn-twinkle 2.4s ease-in-out infinite;
}

.dn__cloud {
  position: absolute;
  height: 0.2em;
  border-radius: 0.2em;
  background: #fff;
  box-shadow: 0 0.04em 0.06em rgba(30, 60, 120, 0.25);
  transition:
    transform 0.7s cubic-bezier(0.5, 0, 0.3, 1),
    opacity 0.5s ease;
}

.dn__cloud::before {
  content: '';
  position: absolute;
  left: 18%;
  bottom: 40%;
  width: 0.2em;
  height: 0.2em;
  border-radius: 50%;
  background: inherit;
}

.dn__cloud--a {
  right: 0.12em;
  bottom: 0.14em;
  width: 0.6em;
  animation: dn-drift 7s ease-in-out infinite alternate;
}

.dn__cloud--b {
  right: 0.5em;
  bottom: 0.38em;
  width: 0.42em;
  opacity: 0.85;
  animation: dn-drift 9s ease-in-out infinite alternate-reverse;
}

.dn__cloud--c {
  right: 0.9em;
  bottom: 0.08em;
  width: 0.45em;
  opacity: 0.7;
  animation: dn-drift 11s ease-in-out infinite alternate;
}

.is-night .dn__cloud {
  transform: translateY(0.9em);
  animation-play-state: paused;
  opacity: 0;
}

.dn__knob {
  position: absolute;
  top: 0.1em;
  left: 0.1em;
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background: #ffd43b;
  box-shadow:
    0 0 0.25em 0.04em rgba(255, 212, 59, 0.75),
    0 0 0.6em 0.1em rgba(255, 190, 40, 0.35),
    inset -0.06em -0.06em 0.1em rgba(255, 140, 0, 0.5);
  transition:
    transform 0.6s cubic-bezier(0.5, -0.3, 0.3, 1.3),
    background 0.5s ease,
    box-shadow 0.5s ease;
  will-change: transform;
}

.is-night .dn__knob {
  transform: translateX(1em);
  background: #e6ebf7;
  box-shadow:
    0 0 0.2em 0.02em rgba(200, 215, 255, 0.55),
    inset -0.08em -0.04em 0.1em rgba(120, 130, 170, 0.6);
}

.dn__crater {
  position: absolute;
  border-radius: 50%;
  background: #c3cadf;
  box-shadow: inset 0.02em 0.02em 0.03em rgba(90, 100, 140, 0.5);
  opacity: 0;
  transform: scale(0);
  transition:
    opacity 0.4s ease 0.2s,
    transform 0.4s ease 0.2s;
}

.is-night .dn__crater {
  opacity: 1;
  transform: scale(1);
}

.dn__crater--a {
  left: 0.12em;
  top: 0.2em;
  width: 0.22em;
  height: 0.22em;
}

.dn__crater--b {
  left: 0.44em;
  top: 0.42em;
  width: 0.2em;
  height: 0.2em;
}

.dn__crater--c {
  left: 0.26em;
  top: 0.54em;
  width: 0.12em;
  height: 0.12em;
}

@keyframes dn-twinkle {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.35;
    transform: scale(0.7);
  }
}

@keyframes dn-drift {
  from {
    margin-right: -0.04em;
  }
  to {
    margin-right: 0.06em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dn__switch,
  .dn__sky,
  .dn__sky::before,
  .dn__star,
  .dn__cloud,
  .dn__knob,
  .dn__crater {
    transition-duration: 0.01ms;
    transition-delay: 0s;
  }

  .is-night .dn__star,
  .dn__cloud {
    animation: none;
  }
}
</style>
