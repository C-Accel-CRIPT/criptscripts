/**
 * Tiny CRIPT API Client to perform basic tasks on Projects
 * - create a Project (POST)
 * - update a Project (PATCH)
 *
 * The goal is to allow user to upload a large JSON by...
 * - creating a childless project
 * - uploading the project chunk by chunk (API has a node max count limit)
 */
import { EdgeUUID, IProject } from "@cript";
import { project } from "../rcbc/data/graph/project";

export type CriptApiClientConstructorOptions = {
  API_BASE_URL: string,
  API_TOKEN: string,
}

export class CriptApiClient {
  private _options: CriptApiClientConstructorOptions;
  constructor(options: CriptApiClientConstructorOptions) {
    this._options = structuredClone(options);
    console.log('CriptApiClient is ready')
  }
  async save_project( payload: Partial<IProject>, uuid?: string ): Promise<any> {

    // prepare
    const body = {...payload, node: ['Project']}; // Ensure "node" field is present

    // save
    let response: any; // TODO: copy type from editor
    if ( !uuid ) {
      // No uuid means not existing, we use POST.
      response = await this.fetch_api( `project`, { method: 'POST' }, body );
      // TODO: consider to try a PATCH if it fails
    } else {
      // Having an uuid means existing
      response = await this.fetch_api( `project/${uuid}`, { method: 'PATCH' }, body );
    }
    const saved_project = response.data.result[0];
    return saved_project;
  }

  async save_project_by_chunk(project: IProject, chunk_size = 10): Promise<{} | void> {

    // Guards
    if( project.collection && project.collection.length > 0 ) throw new Error('project.collection is not handled yet')
    if( project.file && project.file.length > 0 ) throw new Error('project.file is not handled yet')
    if( !project.uuid ) throw new Error('Project must have a uuid in order to be saved chunk by chunk')

    // Save the Project (POST) with no materials
    const { uuid } = await this.save_project( {...project, material: []} )
    if( uuid != project.uuid ) throw new Error('Server response contain a different uuid')

    // Save the Project (PATCH) by chunk of N Material.
    const materials = project.material ?? [];
    const chunk_count = Math.ceil( materials.length / chunk_size );
    console.log(`-- saving ${chunk_count} chunk(s) (size: ${chunk_size})...`);
    for (let chunk_index = 0; chunk_index < chunk_count; chunk_index++ ) {
      console.log(`-- chunk ${chunk_index+1}/${chunk_count} ...`);
      const material_chunk = materials.slice( chunk_index * chunk_size, chunk_index * ( chunk_size + 1 ) ); // fyi, documentation says: "If end is greater than the length of the sequence, slice extracts through to end of the sequence (arr.length)."
      await this.save_project( { material: material_chunk }, uuid );
    }
    console.log(`-- ${chunk_count} chunk(s) (size: ${chunk_size}) done`);

    throw new Error('save_project is not implemented yet');
  }

  private async fetch_api(
    url_sub: string,
    options?: RequestInit,
    body?: Object,
  ) {
    const url = `${this._options.API_BASE_URL}/${url_sub}`;

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._options.API_TOKEN}`,
        ...options?.headers,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error( 'Error while fetching API', { cause: {
          response_text: await response.text(),
          url
        } } );
    }
    return response.json();
  };
}

