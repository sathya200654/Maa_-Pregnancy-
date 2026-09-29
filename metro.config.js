const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Block massive folders from being crawled by Metro fileMap on Windows
config.resolver.blockList = [
  /.*[/\\]jdk17[/\\].*/,
  /.*[/\\]android[/\\].*/,
  /.*[/\\]\.git[/\\].*/,
  /.*\.apk$/,
  /.*\.zip$/,
];

module.exports = config;
