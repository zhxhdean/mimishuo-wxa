const grunt = require('grunt');

grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.initConfig({
  watch: {
    scripts: {
      files: '**/*.scss',
      tasks: ['sass'],
      options: {
        interrupt: true,
      },
    },
  },
  sass: {
    dist: {
      options: {
        sourcemap: 'none',
        trace: true,
        style: 'compressed',
        debugInfo: true
      },
      files: [{
        expand: true,
        cwd: './',
        src: ['./**/*.scss', '!./**/_*.scss'],
        dest: './',
        ext: '.wxss'
      }]
    }
  }
});