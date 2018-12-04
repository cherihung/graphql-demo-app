// tslint:disable
// graphql typescript definitions

declare namespace DemoApp {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
getRegion: IRegion | null;
updateRegion: boolean | null;
getAllRegions: Array<IRegion | null> | null;
removeRegion: boolean | null;
}

interface IGetRegionOnQueryArguments {
RegionId: string;
}

interface IUpdateRegionOnQueryArguments {
Region?: IRegionInput | null;
}

interface IRemoveRegionOnQueryArguments {
RegionId: string;
}

interface IRegion {
__typename: "Region";
Name: string | null;
RegionId: string;
Rulers: string | null;
Capital: string | null;
Media: IMediaData | null;
}

interface IMediaData {
__typename: "MediaData";
Map: string | null;
Shield: string | null;
}

interface IRegionInput {
Name?: string | null;
RegionId: string;
Rulers?: string | null;
Capital?: string | null;
Media?: IMediaInput | null;
}

interface IMediaInput {
Map?: string | null;
Shield?: string | null;
}

interface IMutation {
__typename: "Mutation";
insertRegion: IResponse | null;
}

interface IInsertRegionOnMutationArguments {
Region?: IRegionInput | null;
}

interface IResponse {
__typename: "Response";
response: string | null;
}
}

export default DemoApp;
// tslint:enable
