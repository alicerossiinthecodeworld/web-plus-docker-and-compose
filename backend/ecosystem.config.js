module.exports = {
  apps : [{
    name: 'kupi-podari',
    script: '/app/dist/main.js',
    watch: '.',
    env: {
      NODE_ENV: 'production'
    }
  }],
};