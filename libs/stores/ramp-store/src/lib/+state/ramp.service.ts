import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  Analyte, ChemicalEnrichment,
  Classes,
  EntityCount,
  FisherResult,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  Reaction,
  SourceVersion
} from "@ramp/models/ramp-models";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { fetchCommonReactionAnalytesFile } from './ramp-store/ramp.actions';

const HTTP_OPTIONS = {
  headers: new HttpHeaders(),
  responseType: 'blob' as 'json'
};

const HTTP_TEXT_OPTIONS = {
  headers: new HttpHeaders(),
  responseType: 'text' as 'text'
};

@Injectable({
  providedIn: 'root',
})
export class RampService {
  private url!: string;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private dom: Document
  ) {}

  loadAboutData() {
    return forkJoin({
      sourceVersions: this.fetchSourceVersions(),
      entityCounts: this.fetchEntityCounts(),
      metaboliteIntersects: this.fetchMetaboliteIntersects(),
      geneIntersects: this.fetchGeneIntersects(),
      supportedIds: this.fetchSupportedIds(),
    });
  }

  fetchSourceVersions(): Observable<SourceVersion[]> {
    return this.http
      .get<{ data: SourceVersion[] }>(`${this.url}source_versions`) // ,{responseType: 'text'})
      .pipe(
        map((response) => response.data),
        catchError(this.handleError('fetchSourceVersions', []))
      );
  }

  fetchEntityCounts() {
    return this.http
      .get<{ data: any[] }>(`${this.url}entity_counts`) // ,{responseType: 'text'})
      .pipe(
        map((response) => response.data.map((obj) => new EntityCount(obj))),
        catchError(this.handleError('fetchEntityCounts', []))
      );
  }

  fetchSupportedIds() {
    return this.http
      .get<{ data: any[] }>(`${this.url}id-types`);
  }

  fetchMetaboliteIntersects() {
    return this.fetchAnalyteIntersects('metabolites');
  }

  fetchGeneIntersects() {
    return this.fetchAnalyteIntersects('genes');
  }

  fetchAnalyteIntersects(param: string) {
    return this.http
      .get<{ data: any[] }>(
        `${this.url}analyte_intersects?analytetype=${param}&query_scope=mapped-to-pathway`
      )
      .pipe(
        map((response) => response.data),
        catchError(this.handleError('fetchAnalyteIntersects', []))
      );
  }

  fetchAnalytesFromPathways(pathways: string[]): Observable<{
    analytes: Analyte[];
    functionCall: string;
    numFoundIds: number;
  }> {
    const options = {
      pathway: pathways,
    };
    return this.http
      .post<string[]>(`${this.url}analytes-from-pathways`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            analytes: response.data.map((obj: any) => new Analyte(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
          };
        })
      );
  }

  fetchAnalytesFromPathwaysFile(pathways: string[], format: string) {
    const params = {
      pathway: pathways,
      format: format,
    };
    this.http
      .post<string[]>(`${this.url}analytes-from-pathways`, params, HTTP_OPTIONS)
      .subscribe((response: any) =>
        this._downloadFile(response, 'fetchAnalytesFromPathways')
      );
  }

  fetchPathwaysFromAnalytes(analytes: string[]): Observable<{
    pathways: Pathway[];
    functionCall: string;
    numFoundIds: number;
  }> {
    const options = {
      analytes: analytes,
    };
    return this.http
      .post<string[]>(`${this.url}pathways-from-analytes`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            pathways: response.data.map((obj: any) => new Pathway(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
          };
        })
        //    catchError(this.handleError('pathways from analytes', of({})))
      );
  }

  fetchPathwaysFromAnalytesFile(analytes: string[], format: string) {
    const params = {
      analytes: analytes,
      format: format,
    };
    this.http
      .post<string[]>(`${this.url}pathways-from-analytes`, params, HTTP_OPTIONS)
      .subscribe((response: any) =>
        this._downloadFile(response, 'fetchPathwayFromAnalyte')
      );
  }

  fetchCommonReactionAnalytes(analytes: string[]): Observable<{
    reactions: Reaction[];
    functionCall: string;
    numFoundIds: number;
  }> {
    const options = {
      analyte: analytes,
    };
    return this.http
      .post<string[]>(`${this.url}common-reaction-analytes`, options, HTTP_OPTIONS) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            reactions: response.data.map((obj: any) => new Reaction(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
          };
        })
      );
  }

  fetchCommonReactionAnalytesFile(analytes: string[], format: string) {
    const params = {
      analyte: analytes,
      format: format,
    };
    this.http
      .post<string[]>(
        `${this.url}common-reaction-analytes`,
        params,
        HTTP_OPTIONS
      )
      .subscribe((response: any) =>
        this._downloadFile(response, 'fetchCommonReactionAnalytes')
      );
  }

  fetchChemicalClass(metabolites: string[]): Observable<{
    metClasses: Classes[];
    functionCall: string;
    numFoundIds: number;
  }> {
    const options = {
      metabolites: metabolites,
    };
    return this.http
      .post<string[]>(`${this.url}chemical-classes`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          const metabMap: Map<string, any> = new Map<string, any>();
          response.data.forEach((chClass: any) => {
            let cl = metabMap.get(chClass.sourceId);
            if (cl) {
              cl.levels.push(chClass);
            } else {
              cl = { sourceId: chClass.sourceId, levels: [chClass] };
            }
            metabMap.set(chClass.sourceId, cl);
          });
          return {
            metClasses: [...metabMap.values()].map(
              (obj: any) => new Classes(obj)
            ),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
          };
        })
      );
  }

  fetchClassesFromMetabolitesFile(metabolites: string[], format: string) {
    const params = {
      metabolites: metabolites,
      format: format,
    };
    this.http
      .post<string[]>(`${this.url}chemical-classes`, params, HTTP_OPTIONS)
      .subscribe((response: any) =>
        this._downloadFile(response, 'fetchChemicalClass')
      );
  }

  fetchPropertiesFromMetabolites(metabolites: string[]): Observable<{
    properties: Properties[];
    functionCall: string;
    numFoundIds: number;
  }> {
    const options = {
      metabolites: metabolites,
    };
    return this.http
      .post<string[]>(`${this.url}chemical-properties`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            properties: response.data.map((obj: any) => new Properties(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
          };
        })
      );
  }

  fetchPropertiesFromMetabolitesFile(metabolites: string[], format: string) {
    const params = {
      metabolites: metabolites,
      format: format,
    };
    this.http
      .post<string[]>(`${this.url}chemical-properties`, params, HTTP_OPTIONS)
      .subscribe((response: any) =>
        this._downloadFile(response, 'fetchChemicalProperties')
      );
  }

  fetchEnrichmentFromMetabolites(metabolites: string[]) {
    const options = {
      metabolites: metabolites,
    };
    return this.http
      .post<string[]>(`${this.url}chemical-enrichment`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          const retList: ChemicalEnrichment[] = [];
          [...Object.values(response.data)].forEach((val: any)=> val.forEach((cc:any) => retList.push(new ChemicalEnrichment(cc))));
          return retList;
        }),
        catchError(this.handleError('chemical enrichment', []))
      );
  }

  fetchEnrichmentFromPathways(analytes: string[]): Observable<{
    data: FisherResult[];
    functionCall: string;
    combinedFishersDataframe: any;
  }> {
    return (
      this.http
        .post<string[]>(`${this.url}combined-fisher-test`, {
          pathways: analytes,
        })
        .pipe(
/*
          mergeMap(( req: any) => {
         //  console.log(req);
           const body = {
             fishers_results: req.data,
             text_size: 8,
             perc_analyte_overlap: 0.2,
             min_pathway_tocluster: 2,
             perc_pathway_overlap: 0.2
           }
            const options: Object = {responseType: 'text' as 'text'};

            return this.http
             .post<string[]>(`${this.url}cluster-plot`,body, options)
         }),
*/
          map((response: any) => {
            return {
              data: response.data.fishresults.map((obj: any) => new FisherResult(obj)),
              combinedFishersDataframe: response.data,
              functionCall: response.function_call[0]
            };
          })
        )
    );
  }


  filterPathwayEnrichment(
    dataframe: any,
    pval_type?: string,
    pval_cutoff?: number
  ){
    return this.http.post<string[]>(
      `${this.url}filter-fisher-test-results`,
      {
        fishers_results: dataframe,
        pval_type: pval_type,
        pval_cutoff: pval_cutoff,
      }
    )
      .pipe(
        map((response: any) => {
      return {
        data: response.data.fishresults.map((obj: any) => new FisherResult(obj)),
        filteredFishersDataframe: response.data,
        functionCall: response.function_call[0]
      };
    })
  );
  }

  getClusterdData(
    dataframe: any,
    perc_analyte_overlap?: number,
    min_pathway_tocluster?: number,
    perc_pathway_overlap?: number
  ){
      return forkJoin({
        data: this.clusterPathwayEnrichment(
        dataframe,
        perc_analyte_overlap,
        min_pathway_tocluster,
        perc_pathway_overlap
        ),
        plot: this.fetchClusterPlot(
          dataframe,
          perc_analyte_overlap,
          min_pathway_tocluster,
          perc_pathway_overlap
        ),
      });
  }

  clusterPathwayEnrichment(
    dataframe: any,
    perc_analyte_overlap?: number,
    min_pathway_tocluster?: number,
    perc_pathway_overlap?: number
  ){
    return this.http
      .post<string[]>(`${this.url}cluster-fisher-test-results`,  {
        fishers_results: dataframe,
        perc_analyte_overlap: perc_analyte_overlap,
        min_pathway_tocluster: min_pathway_tocluster,
        perc_pathway_overlap: perc_pathway_overlap,
      })
      .pipe(
        map((response: any) => {
          return {
            data: response.data.fishresults.map((obj: any) => new FisherResult(obj)),
            combinedFishersDataframe: response.data
          };
        }),
        catchError(this.handleError('chemical enrichment', []))
      );
  }

  fetchClusterPlot(
    dataframe: any,
    perc_analyte_overlap?: number,
    min_pathway_tocluster?: number,
    perc_pathway_overlap?: number
  ){
      const body = {
        fishers_results: dataframe,
        text_size: 8,
        perc_analyte_overlap:  perc_analyte_overlap,
        min_pathway_tocluster: min_pathway_tocluster,
        perc_pathway_overlap: perc_pathway_overlap,
        filename: Date.now() + '.svg'
      }
      const options: Object = {responseType: 'text' as 'text'};
      return this.http
        .post<string[]>(`${this.url}cluster-plot`,body, options)
        .pipe(
          map((response: any) => {
            return  response;
          }),
          catchError(this.handleError('chemical enrichment', []))
        );
  }


  fetchOntologiesFromMetabolites(analytes: string[]): Observable<{
    ontologies: Ontology[];
    functionCall: string;
    numFoundIds: number;
  }> {
    const options = {
      metabolite: analytes,
    };
    return this.http
      .post<string[]>(`${this.url}ontologies-from-metabolites`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            ontologies: response.data.map((obj: any) => new Ontology(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
          };
        })
      );
  }

  fetchOntologiesFromMetabolitesFile(metabolite: string[], format: string) {
    const params = {
      metabolite: metabolite,
      format: format,
    };
    this.http
      .post<string[]>(
        `${this.url}ontologies-from-metabolites`,
        params,
        HTTP_OPTIONS
      )
      .subscribe((response: any) =>
        this._downloadFile(response, 'fetchOntologiesFromMetabolites')
      );
  }

  fetchMetabolitesFromOntologies(ontologies: string[]): Observable<{
    metabolites: Metabolite[];
    functionCall: string;
    numFoundIds: number;
  }> {
    const options = {
      ontology: ontologies.join(','),
    };
    return this.http
      .post<string[]>(`${this.url}metabolites-from-ontologies`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            metabolites: response.data.map((obj: any) => new Metabolite(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
          };
        })
      );
  }

  fetchMetabolitesFromOntologiesFile(ontologies: string[], format: string) {
    const params = {
      ontology: ontologies.join(','),
      format: format,
    };
    this.http
      .post<string[]>(
        `${this.url}metabolites-from-ontologies`,
        params,
        HTTP_OPTIONS
      )
      .subscribe((response: any) =>
        this._downloadFile(response, 'fetchMetabolitesFromOntologies')
      );
  }

  fetchOntologies() {
    return this.http
      .get<string[]>(`${this.url}ontology-types`) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          const ontoMap: Map<
            string,
            { ontologyType: string; values: Ontology[] }
          > = new Map<string, { ontologyType: string; values: Ontology[] }>();
          response.uniq_ontology_types.forEach((onto: string) =>
            ontoMap.set(onto, { ontologyType: onto, values: [] })
          );
          response.data.forEach((ontoType: any) => {
            let cl = ontoMap.get(ontoType.HMDBOntologyType);
            if (cl) {
              cl.values.push(new Ontology(ontoType));
            } else {
              cl = {
                ontologyType: ontoType.HMDBOntologyType,
                values: [new Ontology(ontoType)],
              };
            }
            ontoMap.set(ontoType.HMDBOntologyType, cl);
          });
          return {
            data: [...ontoMap.values()],
          };
        })
        //  catchError(this.handleError('pathways from analytes', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  _setUrl(url: string): void {
    this.url = url;
  }

  private _downloadFile(data: Blob, name: string) {
    const file = new Blob([data], { type: 'text/tsv' });
    var link = this.dom.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(file);
      link.setAttribute('href', url);
      link.setAttribute('download', `${name}-download.tsv`);
      link.style.visibility = 'hidden';
      this.dom.body.appendChild(link);
      link.click();
      this.dom.body.removeChild(link);
    }
  }
}
