import { createAction, props } from '@ngrx/store';
import {
  Analyte, ChemicalEnrichment,
  Classes, FisherResult,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  RampQuery,
  Reaction,
  SourceVersion
} from "@ramp/models/ramp-models";
import { RampEntity } from './ramp.models';

export const init = createAction('[Ramp] Init');

export const initSuccess = createAction(
  '[Ramp/API] init Success',
  props<{ data: [{ analyteType: string, idTypes: string[]}]}>()
);

export const initFailure = createAction(
  '[Ramp/API] init Failure',
  props<{ error: any }>()
);
export const initAbout = createAction('[Ramp About Page] Init');

export const loadRampSuccess = createAction(
  '[Ramp/API] Load Ramp Success',
  props<{ rampStore: RampEntity[] }>()
);

export const loadRampFailure = createAction(
  '[Ramp/API] Load Ramp Failure',
  props<{ error: any }>()
);

export const loadRampAboutSuccess = createAction(
  '[Ramp/API] Load Ramp About Success',
  props<{ data: any }>()
);

export const loadRampAboutFailure = createAction(
  '[Ramp/API] Load Ramp About Failure',
  props<{ error: any }>()
);

export const loadSourceVersions = createAction(
  '[Ramp/API] Load SourceVersions'
);

export const loadSourceVersionsSuccess = createAction(
  '[Ramp/API] Load SourceVersions Success',
  props<{ versions: SourceVersion[] }>()
);

export const loadSourceVersionsFailure = createAction(
  '[Ramp/API] Load SourceVersions Failure',
  props<{ error: any }>()
);

export const loadEntityCounts = createAction('[Ramp/API] Load EntityCounts');

export const loadEntityCountsSuccess = createAction(
  '[Ramp/API] Load EntityCounts Success',
  props<{ rampStore: RampEntity[] }>()
);

export const loadEntityCountsFailure = createAction(
  '[Ramp/API] Load EntityCounts Failure',
  props<{ error: any }>()
);

export const loadAnalyteIntersects = createAction(
  '[Ramp/API] Load AnalyteIntersects'
);

export const loadAnalyteIntersectsSuccess = createAction(
  '[Ramp/API] Load AnalyteIntersects Success',
  props<{ rampStore: RampEntity[] }>()
);

export const loadAnalyteIntersectsFailure = createAction(
  '[Ramp/API] Load AnalyteIntersects Failure',
  props<{ error: any }>()
);

export const fetchPathwaysFromAnalytes = createAction(
  '[Ramp/API] Fetch fetchPathwaysFromAnalytes',
  props<{ analytes: string[] }>()
);

export const fetchPathwaysFromAnalytesSuccess = createAction(
  '[Ramp/API] Fetch fetchPathwaysFromAnalytes Success',
  props<{
    data: Pathway[];
    query: RampQuery;
    dataframe: any;
  }>()
);

export const fetchPathwaysFromAnalytesFailure = createAction(
  '[Ramp/API] Fetch fetchPathwaysFromAnalytes Failure',
  props<{ error: any }>()
);

export const fetchAnalytesFromPathways = createAction(
  '[Ramp/API] Fetch fetchAnalytesFromPathways',
  props<{ pathways: string[] }>()
);

export const fetchAnalytesFromPathwaysSuccess = createAction(
  '[Ramp/API] Fetch fetchAnalytesFromPathways Success',
  props<{
    data: Analyte[];
    query: RampQuery;
    dataframe: any;
  }>()
);

export const fetchAnalytesFromPathwaysFailure = createAction(
  '[Ramp/API] Fetch fetchAnalytesFromPathways Failure',
  props<{ error: any }>()
);

export const fetchOntologiesFromMetabolites = createAction(
  '[Ramp/API] Fetch OntologiesFromMetabolites',
  props<{ analytes: string[] }>()
);

export const fetchOntologiesFromMetabolitesSuccess = createAction(
  '[Ramp/API] Fetch OntologiesFromMetabolites Success',
  props<{
    data: Ontology[];
    query: RampQuery;
    dataframe: any
  }>()
);

export const fetchOntologiesFromMetabolitesFailure = createAction(
  '[Ramp/API] Fetch OntologiesFromMetabolites Failure',
  props<{ error: any }>()
);

export const fetchOntologies = createAction('[Ramp/API] Fetch fetchOntologies');

export const fetchOntologiesSuccess = createAction(
  '[Ramp/API] Fetch fetchOntologies Success',
  props<{ ontologies: any[] }>()
);

export const fetchOntologiesFailure = createAction(
  '[Ramp/API] Fetch fetchOntologies Failure',
  props<{ error: any }>()
);

export const fetchMetabolitesFromOntologies = createAction(
  '[Ramp/API] fetchMetabolitesFromOntologies',
  props<{ ontologies: string[] }>()
);

export const fetchMetabolitesFromOntologiesFile = createAction(
  '[Ramp/API] fetchMetabolitesFromOntologiesFile',
  props<{ ontologies: string[]; format: string }>()
);

export const fetchMetabolitesFromOntologiesSuccess = createAction(
  '[Ramp/API] fetchMetabolitesFromOntologies Success',
  props<{
    data: Metabolite[];
    query: RampQuery;
    dataframe: any;
  }>()
);

export const fetchMetaboliteFromOntologiesFailure = createAction(
  '[Ramp/API] Fetch Metabolite From Ontologies Failure',
  props<{ error: any }>()
);

export const fetchClassesFromMetabolites = createAction(
  '[Ramp/API] Fetch fetchClassesFromMetabolites',
  props<{
    metabolites: string[],
    biospecimen?: string;
    background?: File;
  }>()
);

export const fetchClassesFromMetabolitesSuccess = createAction(
  '[Ramp/API] Fetch fetchClassesFromMetabolites Success',
  props<{
    data: Classes[];
    query: RampQuery;
    dataframe: any;
  }>()
);

export const fetchClassesFromMetabolitesFailure = createAction(
  '[Ramp/API] Fetch fetchClassesFromMetabolites Failure',
  props<{ error: any }>()
);

export const fetchPropertiesFromMetabolites = createAction(
  '[Ramp/API] Fetch fetchPropertiesFromMetabolites',
  props<{ metabolites: string[] }>()
);

export const fetchPropertiesFromMetabolitesSuccess = createAction(
  '[Ramp/API] Fetch fetchPropertiesFromMetabolites Success',
  props<{
    data: Properties[];
    query: RampQuery;
    dataframe: any;
  }>()
);

export const fetchPropertiesFromMetabolitesFailure = createAction(
  '[Ramp/API] Fetch fetchPropertiesFromMetabolites Failure',
  props<{ error: any }>()
);

export const fetchCommonReactionAnalytes = createAction(
  '[Ramp/API] Fetch fetchCommonReactionAnalytes',
  props<{ analytes: string[] }>()
);

export const fetchCommonReactionAnalytesSuccess = createAction(
  '[Ramp/API] Fetch fetchCommonReactionAnalytes Success',
  props<{
    data: Reaction[];
    query: RampQuery;
    dataframe: any;
  }>()
);

export const fetchCommonReactionAnalytesFailure = createAction(
  '[Ramp/API] Fetch fetchCommonReactionAnalytes Failure',
  props<{ error: any }>()
);

export const fetchEnrichmentFromPathways = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromPathways',
  props<{
    analytes: string[];
    biospecimen?: string;
    background?: File;
  }>()
);

export const fetchEnrichmentFromPathwaysSuccess = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromPathways Success',
  props<{
    data: FisherResult[];
    query: RampQuery;
    combinedFishersDataframe: any;
    pval_type?: string;
    pval_cutoff?: number;
  }>()
);

export const fetchEnrichmentFromPathwaysFailure = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromPathways Failure',
  props<{ error: any }>()
);


export const filterEnrichmentFromPathways = createAction(
  '[Ramp/API] Fetch filterEnrichmentFromPathways',
  props<{
    pval_type: string;
    pval_cutoff: number;
    perc_analyte_overlap?: number;
    min_pathway_tocluster?: number;
    perc_pathway_overlap?: number;
  }>()
);

export const filterEnrichmentFromPathwaysSuccess = createAction(
  '[Ramp/API] filterEnrichmentFromPathways Success',
  props<{
    data: FisherResult[];
    query: RampQuery;
    filteredFishersDataframe?: any;
    perc_analyte_overlap?: number;
    min_pathway_tocluster?: number;
    perc_pathway_overlap?: number;
  }>()
);

export const filterEnrichmentFromPathwaysFailure = createAction(
  '[Ramp/API]  filterEnrichmentFromPathways Failure',
  props<{ error: any }>()
);


export const fetchClusterFromEnrichment = createAction(
  '[Ramp/API] Fetch fetchClusterFromEnrichment',
  props<{
    perc_analyte_overlap: number;
    min_pathway_tocluster: number;
    perc_pathway_overlap: number;
  }>()
);

export const fetchClusterFromEnrichmentSuccess = createAction(
  '[Ramp/API] Fetch fetchClusterFromEnrichment Success',
  props<{
    data: FisherResult[];
    plot: any;
    query: RampQuery;
    dataframe: any;
  }>()
);

export const fetchClusterFromEnrichmentFailure = createAction(
  '[Ramp/API] Fetch fetchClusterFromEnrichment Failure',
  props<{ error: any }>()
);

export const fetchClusterImageFile = createAction(
  '[Ramp/API] Fetch fetchClusterImageFile',
  props<{
    perc_analyte_overlap: number;
    min_pathway_tocluster: number;
    perc_pathway_overlap: number;
  }>()
);

export const fetchEnrichmentFromMetabolites = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromMetabolites',
  props<{
    metabolites: string[],
    biospecimen?: string;
    background?: File;
  }>()
);

export const fetchEnrichmentFromMetabolitesFile = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromMetabolitesFile',
  props<{ metabolites: string[], format: string }>()
);

export const fetchEnrichmentFromMetabolitesSuccess = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromMetabolites Success',
  props<{
    data: ChemicalEnrichment[];
    enriched_chemical_class?: any;
    pval_type?: string;
    pval_cutoff?: number;
    dataframe: any;
}>()
);

export const filterEnrichmentFromMetabolites = createAction(
  '[Ramp/API] filterEnrichmentFromMetabolites',
  props<{
    pval_type: string;
    pval_cutoff: number;
  }>()
);

export const filterEnrichmentFromMetabolitesSuccess = createAction(
  '[Ramp/API] filterEnrichmentFromMetabolites Success',
  props<{
    data: ChemicalEnrichment[];
    enriched_chemical_class?: any;
  }>()
);

export const fetchEnrichmentFromMetabolitesFailure = createAction(
  '[Ramp/API] Fetch fetchEnrichmentFromMetabolites Failure',
  props<{ error: any }>()
);

export const filterEnrichmentFromMetabolitesFailure = createAction(
  '[Ramp/API] Fetch filterEnrichmentFromMetabolites Failure',
  props<{ error: any }>()
);

