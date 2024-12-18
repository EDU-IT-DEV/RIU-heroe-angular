module.exports = function(config) {
  config.set({
      frameworks: ['jasmine'],
      files: [],
      browsers: ['Chrome'],
      plugins: [
          'karma-jasmine',
          'karma-chrome-launcher'
      ],
      singleRun: true
  });
};
