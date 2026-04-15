function AnalysisInputSection() {
  return (
    <section>
      <h2>Analysis Panel</h2>
      <p>
        Enter your experimental data here. This is the initial input area for
        guest analysis.
      </p>

      <div>
        <label htmlFor="dataset-name">Dataset name</label>
        <input
          id="dataset-name"
          type="text"
          placeholder="Example: Dopamine-stimulated mice"
        />
      </div>

      <div>
        <label htmlFor="raw-values">Values</label>
        <textarea
          id="raw-values"
          rows="8"
          placeholder="Enter one value per line."
        />
      </div>
    </section>
  );
}

export default AnalysisInputSection;