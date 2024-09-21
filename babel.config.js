module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: {
        node: "current"
      }
    }],
    "@babel/preset-react" // Ensure you have the React preset if you're using React
  ],
  plugins: [
    "@babel/plugin-proposal-private-property-in-object"
  ]
};
