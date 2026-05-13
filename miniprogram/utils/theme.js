"use strict";

const THEME_PRESETS = [
  {
    maxScore: 39,
    name: "霓虹冷调",
    bg: "linear-gradient(135deg,#121a3d,#1f2a67,#26358a)"
  },
  {
    maxScore: 79,
    name: "跃迁暖调",
    bg: "linear-gradient(135deg,#1b2e64,#3e54c7,#9b51ff)"
  },
  {
    maxScore: Infinity,
    name: "共振高能",
    bg: "linear-gradient(135deg,#141a43,#255de7,#00d3ff)"
  }
];

function getThemeByScore(score) {
  const currentScore = typeof score === "number" ? score : 50;
  return THEME_PRESETS.find((theme) => currentScore <= theme.maxScore) || THEME_PRESETS[THEME_PRESETS.length - 1];
}

module.exports = {
  getThemeByScore
};
