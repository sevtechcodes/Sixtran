'use strict';
const {BigQuery} = require('@google-cloud/bigquery');
const options = {
  keyFilename: '/Users/sebastian/Desktop/Codeworks/sixtran/sixtran.json',
  projectId: 'sixtran-426005',
};
const bigquery = new BigQuery(options);


async function getQueries (dataset_id) {
  const query = `
    SELECT
      creation_time,
      t.table_id,
      job_type,
      statement_type,
      COUNT(*) AS num_references,
      IFNULL(SUM(dml_statistics.deleted_row_count), 0) deleted_rows,
      IFNULL(SUM(dml_statistics.updated_row_count), 0) updated_rows,
      IFNULL(SUM(dml_statistics.inserted_row_count), 0) inserted_rows,
    FROM
      \`sixtran-426005.region-eu\`.INFORMATION_SCHEMA.JOBS, UNNEST(referenced_tables) AS t
    where t.dataset_id = @dataset_id 
    AND t.table_id != 'INFORMATION_SCHEMA.TABLES'
    GROUP BY 1,2,3,4`;

  const options = {
    query: query,
    location: 'EU',
    params: {dataset_id: dataset_id},
  };
  try {
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    return rows;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export default async function handler (req, res) {
  const { dataset_id } = req.query;
  try {
    const rows = await getQueries(dataset_id);
    const data = JSON.stringify(rows);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
