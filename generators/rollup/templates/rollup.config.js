import babel from 'rollup-plugin-babel'

export default {
  entry: '<%= entry %>',
  dest: '<%= dest %>',
  format: 'umd',
  moduleName: '<%= name %>'
  plugins: [
    babel()
  ]
}

