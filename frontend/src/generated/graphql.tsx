import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** A time string with format: HH:mm:ss.SSS */
  Time: any;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** The `Long` scalar type represents 52-bit integers */
  Long: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type FileInfoInput = {
  name?: Maybe<Scalars['String']>;
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
};

export type UsersPermissionsMe = {
  __typename?: 'UsersPermissionsMe';
  id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  confirmed?: Maybe<Scalars['Boolean']>;
  blocked?: Maybe<Scalars['Boolean']>;
  role?: Maybe<UsersPermissionsMeRole>;
};

export type UsersPermissionsMeRole = {
  __typename?: 'UsersPermissionsMeRole';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type UsersPermissionsRegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String'];
  password: Scalars['String'];
  provider?: Maybe<Scalars['String']>;
};

export type UsersPermissionsLoginPayload = {
  __typename?: 'UsersPermissionsLoginPayload';
  jwt?: Maybe<Scalars['String']>;
  user: UsersPermissionsMe;
};

export type UserPermissionsPasswordPayload = {
  __typename?: 'UserPermissionsPasswordPayload';
  ok: Scalars['Boolean'];
};

export enum Enum_Article_Status {
  Draft = 'draft',
  Published = 'published'
}

export type Article = {
  __typename?: 'Article';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  title: Scalars['String'];
  description: Scalars['String'];
  content: Scalars['String'];
  publishedAt: Scalars['DateTime'];
  status: Enum_Article_Status;
  slug: Scalars['String'];
  category?: Maybe<Category>;
  image?: Maybe<UploadFile>;
  author?: Maybe<Writer>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};


export type ArticleTagsArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type ArticleConnection = {
  __typename?: 'ArticleConnection';
  values?: Maybe<Array<Maybe<Article>>>;
  groupBy?: Maybe<ArticleGroupBy>;
  aggregate?: Maybe<ArticleAggregator>;
};

export type ArticleAggregator = {
  __typename?: 'ArticleAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type ArticleGroupBy = {
  __typename?: 'ArticleGroupBy';
  id?: Maybe<Array<Maybe<ArticleConnectionId>>>;
  _id?: Maybe<Array<Maybe<ArticleConnection_Id>>>;
  createdAt?: Maybe<Array<Maybe<ArticleConnectionCreatedAt>>>;
  updatedAt?: Maybe<Array<Maybe<ArticleConnectionUpdatedAt>>>;
  title?: Maybe<Array<Maybe<ArticleConnectionTitle>>>;
  description?: Maybe<Array<Maybe<ArticleConnectionDescription>>>;
  content?: Maybe<Array<Maybe<ArticleConnectionContent>>>;
  publishedAt?: Maybe<Array<Maybe<ArticleConnectionPublishedAt>>>;
  status?: Maybe<Array<Maybe<ArticleConnectionStatus>>>;
  slug?: Maybe<Array<Maybe<ArticleConnectionSlug>>>;
  category?: Maybe<Array<Maybe<ArticleConnectionCategory>>>;
  image?: Maybe<Array<Maybe<ArticleConnectionImage>>>;
  author?: Maybe<Array<Maybe<ArticleConnectionAuthor>>>;
};

export type ArticleConnectionId = {
  __typename?: 'ArticleConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnection_Id = {
  __typename?: 'ArticleConnection_id';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionCreatedAt = {
  __typename?: 'ArticleConnectionCreatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionUpdatedAt = {
  __typename?: 'ArticleConnectionUpdatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionTitle = {
  __typename?: 'ArticleConnectionTitle';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionDescription = {
  __typename?: 'ArticleConnectionDescription';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionContent = {
  __typename?: 'ArticleConnectionContent';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionPublishedAt = {
  __typename?: 'ArticleConnectionPublishedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionStatus = {
  __typename?: 'ArticleConnectionStatus';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionSlug = {
  __typename?: 'ArticleConnectionSlug';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionCategory = {
  __typename?: 'ArticleConnectionCategory';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionImage = {
  __typename?: 'ArticleConnectionImage';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleConnectionAuthor = {
  __typename?: 'ArticleConnectionAuthor';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<ArticleConnection>;
};

export type ArticleInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  content: Scalars['String'];
  publishedAt: Scalars['DateTime'];
  status?: Maybe<Enum_Article_Status>;
  slug: Scalars['String'];
  category?: Maybe<Scalars['ID']>;
  image?: Maybe<Scalars['ID']>;
  author?: Maybe<Scalars['ID']>;
  tags?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditArticleInput = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  status?: Maybe<Enum_Article_Status>;
  slug?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['ID']>;
  image?: Maybe<Scalars['ID']>;
  author?: Maybe<Scalars['ID']>;
  tags?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateArticleInput = {
  data?: Maybe<ArticleInput>;
};

export type CreateArticlePayload = {
  __typename?: 'createArticlePayload';
  article?: Maybe<Article>;
};

export type UpdateArticleInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditArticleInput>;
};

export type UpdateArticlePayload = {
  __typename?: 'updateArticlePayload';
  article?: Maybe<Article>;
};

export type DeleteArticleInput = {
  where?: Maybe<InputId>;
};

export type DeleteArticlePayload = {
  __typename?: 'deleteArticlePayload';
  article?: Maybe<Article>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  slug: Scalars['String'];
  articles?: Maybe<Array<Maybe<Article>>>;
};


export type CategoryArticlesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type CategoryConnection = {
  __typename?: 'CategoryConnection';
  values?: Maybe<Array<Maybe<Category>>>;
  groupBy?: Maybe<CategoryGroupBy>;
  aggregate?: Maybe<CategoryAggregator>;
};

export type CategoryAggregator = {
  __typename?: 'CategoryAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type CategoryGroupBy = {
  __typename?: 'CategoryGroupBy';
  id?: Maybe<Array<Maybe<CategoryConnectionId>>>;
  _id?: Maybe<Array<Maybe<CategoryConnection_Id>>>;
  createdAt?: Maybe<Array<Maybe<CategoryConnectionCreatedAt>>>;
  updatedAt?: Maybe<Array<Maybe<CategoryConnectionUpdatedAt>>>;
  name?: Maybe<Array<Maybe<CategoryConnectionName>>>;
  slug?: Maybe<Array<Maybe<CategoryConnectionSlug>>>;
};

export type CategoryConnectionId = {
  __typename?: 'CategoryConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<CategoryConnection>;
};

export type CategoryConnection_Id = {
  __typename?: 'CategoryConnection_id';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<CategoryConnection>;
};

export type CategoryConnectionCreatedAt = {
  __typename?: 'CategoryConnectionCreatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<CategoryConnection>;
};

export type CategoryConnectionUpdatedAt = {
  __typename?: 'CategoryConnectionUpdatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<CategoryConnection>;
};

export type CategoryConnectionName = {
  __typename?: 'CategoryConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<CategoryConnection>;
};

export type CategoryConnectionSlug = {
  __typename?: 'CategoryConnectionSlug';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<CategoryConnection>;
};

export type CategoryInput = {
  name: Scalars['String'];
  slug: Scalars['String'];
  articles?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditCategoryInput = {
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  articles?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateCategoryInput = {
  data?: Maybe<CategoryInput>;
};

export type CreateCategoryPayload = {
  __typename?: 'createCategoryPayload';
  category?: Maybe<Category>;
};

export type UpdateCategoryInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditCategoryInput>;
};

export type UpdateCategoryPayload = {
  __typename?: 'updateCategoryPayload';
  category?: Maybe<Category>;
};

export type DeleteCategoryInput = {
  where?: Maybe<InputId>;
};

export type DeleteCategoryPayload = {
  __typename?: 'deleteCategoryPayload';
  category?: Maybe<Category>;
};

export type Global = {
  __typename?: 'Global';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  favicon?: Maybe<UploadFile>;
  siteName: Scalars['String'];
  defaultSeo?: Maybe<ComponentSharedSeo>;
  copyrightNotice?: Maybe<Scalars['String']>;
};

export type GlobalInput = {
  favicon?: Maybe<Scalars['ID']>;
  siteName: Scalars['String'];
  defaultSeo: ComponentSharedSeoInput;
  copyrightNotice?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditGlobalInput = {
  favicon?: Maybe<Scalars['ID']>;
  siteName?: Maybe<Scalars['String']>;
  defaultSeo?: Maybe<EditComponentSharedSeoInput>;
  copyrightNotice?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type UpdateGlobalInput = {
  data?: Maybe<EditGlobalInput>;
};

export type UpdateGlobalPayload = {
  __typename?: 'updateGlobalPayload';
  global?: Maybe<Global>;
};

export type DeleteGlobalPayload = {
  __typename?: 'deleteGlobalPayload';
  global?: Maybe<Global>;
};

export type Homepage = {
  __typename?: 'Homepage';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  seo?: Maybe<ComponentSharedSeo>;
  hero?: Maybe<ComponentSectionsHero>;
};

export type HomepageInput = {
  seo?: Maybe<ComponentSharedSeoInput>;
  hero: ComponentSectionsHeroInput;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditHomepageInput = {
  seo?: Maybe<EditComponentSharedSeoInput>;
  hero?: Maybe<EditComponentSectionsHeroInput>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type UpdateHomepageInput = {
  data?: Maybe<EditHomepageInput>;
};

export type UpdateHomepagePayload = {
  __typename?: 'updateHomepagePayload';
  homepage?: Maybe<Homepage>;
};

export type DeleteHomepagePayload = {
  __typename?: 'deleteHomepagePayload';
  homepage?: Maybe<Homepage>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type TagConnection = {
  __typename?: 'TagConnection';
  values?: Maybe<Array<Maybe<Tag>>>;
  groupBy?: Maybe<TagGroupBy>;
  aggregate?: Maybe<TagAggregator>;
};

export type TagAggregator = {
  __typename?: 'TagAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type TagGroupBy = {
  __typename?: 'TagGroupBy';
  id?: Maybe<Array<Maybe<TagConnectionId>>>;
  _id?: Maybe<Array<Maybe<TagConnection_Id>>>;
  createdAt?: Maybe<Array<Maybe<TagConnectionCreatedAt>>>;
  updatedAt?: Maybe<Array<Maybe<TagConnectionUpdatedAt>>>;
  name?: Maybe<Array<Maybe<TagConnectionName>>>;
  slug?: Maybe<Array<Maybe<TagConnectionSlug>>>;
};

export type TagConnectionId = {
  __typename?: 'TagConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<TagConnection>;
};

export type TagConnection_Id = {
  __typename?: 'TagConnection_id';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<TagConnection>;
};

export type TagConnectionCreatedAt = {
  __typename?: 'TagConnectionCreatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<TagConnection>;
};

export type TagConnectionUpdatedAt = {
  __typename?: 'TagConnectionUpdatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<TagConnection>;
};

export type TagConnectionName = {
  __typename?: 'TagConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<TagConnection>;
};

export type TagConnectionSlug = {
  __typename?: 'TagConnectionSlug';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<TagConnection>;
};

export type TagInput = {
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditTagInput = {
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateTagInput = {
  data?: Maybe<TagInput>;
};

export type CreateTagPayload = {
  __typename?: 'createTagPayload';
  tag?: Maybe<Tag>;
};

export type UpdateTagInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditTagInput>;
};

export type UpdateTagPayload = {
  __typename?: 'updateTagPayload';
  tag?: Maybe<Tag>;
};

export type DeleteTagInput = {
  where?: Maybe<InputId>;
};

export type DeleteTagPayload = {
  __typename?: 'deleteTagPayload';
  tag?: Maybe<Tag>;
};

export type Writer = {
  __typename?: 'Writer';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  picture?: Maybe<UploadFile>;
  email?: Maybe<Scalars['String']>;
  articles?: Maybe<Array<Maybe<Article>>>;
};


export type WriterArticlesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type WriterConnection = {
  __typename?: 'WriterConnection';
  values?: Maybe<Array<Maybe<Writer>>>;
  groupBy?: Maybe<WriterGroupBy>;
  aggregate?: Maybe<WriterAggregator>;
};

export type WriterAggregator = {
  __typename?: 'WriterAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type WriterGroupBy = {
  __typename?: 'WriterGroupBy';
  id?: Maybe<Array<Maybe<WriterConnectionId>>>;
  _id?: Maybe<Array<Maybe<WriterConnection_Id>>>;
  createdAt?: Maybe<Array<Maybe<WriterConnectionCreatedAt>>>;
  updatedAt?: Maybe<Array<Maybe<WriterConnectionUpdatedAt>>>;
  name?: Maybe<Array<Maybe<WriterConnectionName>>>;
  picture?: Maybe<Array<Maybe<WriterConnectionPicture>>>;
  email?: Maybe<Array<Maybe<WriterConnectionEmail>>>;
};

export type WriterConnectionId = {
  __typename?: 'WriterConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<WriterConnection>;
};

export type WriterConnection_Id = {
  __typename?: 'WriterConnection_id';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<WriterConnection>;
};

export type WriterConnectionCreatedAt = {
  __typename?: 'WriterConnectionCreatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<WriterConnection>;
};

export type WriterConnectionUpdatedAt = {
  __typename?: 'WriterConnectionUpdatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<WriterConnection>;
};

export type WriterConnectionName = {
  __typename?: 'WriterConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<WriterConnection>;
};

export type WriterConnectionPicture = {
  __typename?: 'WriterConnectionPicture';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<WriterConnection>;
};

export type WriterConnectionEmail = {
  __typename?: 'WriterConnectionEmail';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<WriterConnection>;
};

export type WriterInput = {
  name?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['ID']>;
  articles?: Maybe<Array<Maybe<Scalars['ID']>>>;
  email?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditWriterInput = {
  name?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['ID']>;
  articles?: Maybe<Array<Maybe<Scalars['ID']>>>;
  email?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateWriterInput = {
  data?: Maybe<WriterInput>;
};

export type CreateWriterPayload = {
  __typename?: 'createWriterPayload';
  writer?: Maybe<Writer>;
};

export type UpdateWriterInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditWriterInput>;
};

export type UpdateWriterPayload = {
  __typename?: 'updateWriterPayload';
  writer?: Maybe<Writer>;
};

export type DeleteWriterInput = {
  where?: Maybe<InputId>;
};

export type DeleteWriterPayload = {
  __typename?: 'deleteWriterPayload';
  writer?: Maybe<Writer>;
};

export type UploadFile = {
  __typename?: 'UploadFile';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  name: Scalars['String'];
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  formats?: Maybe<Scalars['JSON']>;
  hash: Scalars['String'];
  ext?: Maybe<Scalars['String']>;
  mime: Scalars['String'];
  size: Scalars['Float'];
  url: Scalars['String'];
  previewUrl?: Maybe<Scalars['String']>;
  provider: Scalars['String'];
  provider_metadata?: Maybe<Scalars['JSON']>;
  related?: Maybe<Array<Maybe<Morph>>>;
};


export type UploadFileRelatedArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type UploadFileConnection = {
  __typename?: 'UploadFileConnection';
  values?: Maybe<Array<Maybe<UploadFile>>>;
  groupBy?: Maybe<UploadFileGroupBy>;
  aggregate?: Maybe<UploadFileAggregator>;
};

export type UploadFileAggregator = {
  __typename?: 'UploadFileAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
  sum?: Maybe<UploadFileAggregatorSum>;
  avg?: Maybe<UploadFileAggregatorAvg>;
  min?: Maybe<UploadFileAggregatorMin>;
  max?: Maybe<UploadFileAggregatorMax>;
};

export type UploadFileAggregatorSum = {
  __typename?: 'UploadFileAggregatorSum';
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
};

export type UploadFileAggregatorAvg = {
  __typename?: 'UploadFileAggregatorAvg';
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
};

export type UploadFileAggregatorMin = {
  __typename?: 'UploadFileAggregatorMin';
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
};

export type UploadFileAggregatorMax = {
  __typename?: 'UploadFileAggregatorMax';
  width?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Float']>;
};

export type UploadFileGroupBy = {
  __typename?: 'UploadFileGroupBy';
  id?: Maybe<Array<Maybe<UploadFileConnectionId>>>;
  _id?: Maybe<Array<Maybe<UploadFileConnection_Id>>>;
  createdAt?: Maybe<Array<Maybe<UploadFileConnectionCreatedAt>>>;
  updatedAt?: Maybe<Array<Maybe<UploadFileConnectionUpdatedAt>>>;
  name?: Maybe<Array<Maybe<UploadFileConnectionName>>>;
  alternativeText?: Maybe<Array<Maybe<UploadFileConnectionAlternativeText>>>;
  caption?: Maybe<Array<Maybe<UploadFileConnectionCaption>>>;
  width?: Maybe<Array<Maybe<UploadFileConnectionWidth>>>;
  height?: Maybe<Array<Maybe<UploadFileConnectionHeight>>>;
  formats?: Maybe<Array<Maybe<UploadFileConnectionFormats>>>;
  hash?: Maybe<Array<Maybe<UploadFileConnectionHash>>>;
  ext?: Maybe<Array<Maybe<UploadFileConnectionExt>>>;
  mime?: Maybe<Array<Maybe<UploadFileConnectionMime>>>;
  size?: Maybe<Array<Maybe<UploadFileConnectionSize>>>;
  url?: Maybe<Array<Maybe<UploadFileConnectionUrl>>>;
  previewUrl?: Maybe<Array<Maybe<UploadFileConnectionPreviewUrl>>>;
  provider?: Maybe<Array<Maybe<UploadFileConnectionProvider>>>;
  provider_metadata?: Maybe<Array<Maybe<UploadFileConnectionProvider_Metadata>>>;
};

export type UploadFileConnectionId = {
  __typename?: 'UploadFileConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnection_Id = {
  __typename?: 'UploadFileConnection_id';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionCreatedAt = {
  __typename?: 'UploadFileConnectionCreatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionUpdatedAt = {
  __typename?: 'UploadFileConnectionUpdatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionName = {
  __typename?: 'UploadFileConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionAlternativeText = {
  __typename?: 'UploadFileConnectionAlternativeText';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionCaption = {
  __typename?: 'UploadFileConnectionCaption';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionWidth = {
  __typename?: 'UploadFileConnectionWidth';
  key?: Maybe<Scalars['Int']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionHeight = {
  __typename?: 'UploadFileConnectionHeight';
  key?: Maybe<Scalars['Int']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionFormats = {
  __typename?: 'UploadFileConnectionFormats';
  key?: Maybe<Scalars['JSON']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionHash = {
  __typename?: 'UploadFileConnectionHash';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionExt = {
  __typename?: 'UploadFileConnectionExt';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionMime = {
  __typename?: 'UploadFileConnectionMime';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionSize = {
  __typename?: 'UploadFileConnectionSize';
  key?: Maybe<Scalars['Float']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionUrl = {
  __typename?: 'UploadFileConnectionUrl';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionPreviewUrl = {
  __typename?: 'UploadFileConnectionPreviewUrl';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionProvider = {
  __typename?: 'UploadFileConnectionProvider';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UploadFileConnection>;
};

export type UploadFileConnectionProvider_Metadata = {
  __typename?: 'UploadFileConnectionProvider_metadata';
  key?: Maybe<Scalars['JSON']>;
  connection?: Maybe<UploadFileConnection>;
};

export type FileInput = {
  name: Scalars['String'];
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  formats?: Maybe<Scalars['JSON']>;
  hash: Scalars['String'];
  ext?: Maybe<Scalars['String']>;
  mime: Scalars['String'];
  size: Scalars['Float'];
  url: Scalars['String'];
  previewUrl?: Maybe<Scalars['String']>;
  provider: Scalars['String'];
  provider_metadata?: Maybe<Scalars['JSON']>;
  related?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditFileInput = {
  name?: Maybe<Scalars['String']>;
  alternativeText?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  formats?: Maybe<Scalars['JSON']>;
  hash?: Maybe<Scalars['String']>;
  ext?: Maybe<Scalars['String']>;
  mime?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Float']>;
  url?: Maybe<Scalars['String']>;
  previewUrl?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  provider_metadata?: Maybe<Scalars['JSON']>;
  related?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type DeleteFileInput = {
  where?: Maybe<InputId>;
};

export type DeleteFilePayload = {
  __typename?: 'deleteFilePayload';
  file?: Maybe<UploadFile>;
};

export type UsersPermissionsPermission = {
  __typename?: 'UsersPermissionsPermission';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  type: Scalars['String'];
  controller: Scalars['String'];
  action: Scalars['String'];
  enabled: Scalars['Boolean'];
  policy?: Maybe<Scalars['String']>;
  role?: Maybe<UsersPermissionsRole>;
};

export type UsersPermissionsRole = {
  __typename?: 'UsersPermissionsRole';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<UsersPermissionsPermission>>>;
  users?: Maybe<Array<Maybe<UsersPermissionsUser>>>;
};


export type UsersPermissionsRolePermissionsArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type UsersPermissionsRoleUsersArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type UsersPermissionsRoleConnection = {
  __typename?: 'UsersPermissionsRoleConnection';
  values?: Maybe<Array<Maybe<UsersPermissionsRole>>>;
  groupBy?: Maybe<UsersPermissionsRoleGroupBy>;
  aggregate?: Maybe<UsersPermissionsRoleAggregator>;
};

export type UsersPermissionsRoleAggregator = {
  __typename?: 'UsersPermissionsRoleAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type UsersPermissionsRoleGroupBy = {
  __typename?: 'UsersPermissionsRoleGroupBy';
  id?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionId>>>;
  _id?: Maybe<Array<Maybe<UsersPermissionsRoleConnection_Id>>>;
  name?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionName>>>;
  description?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionDescription>>>;
  type?: Maybe<Array<Maybe<UsersPermissionsRoleConnectionType>>>;
};

export type UsersPermissionsRoleConnectionId = {
  __typename?: 'UsersPermissionsRoleConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UsersPermissionsRoleConnection>;
};

export type UsersPermissionsRoleConnection_Id = {
  __typename?: 'UsersPermissionsRoleConnection_id';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UsersPermissionsRoleConnection>;
};

export type UsersPermissionsRoleConnectionName = {
  __typename?: 'UsersPermissionsRoleConnectionName';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsRoleConnection>;
};

export type UsersPermissionsRoleConnectionDescription = {
  __typename?: 'UsersPermissionsRoleConnectionDescription';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsRoleConnection>;
};

export type UsersPermissionsRoleConnectionType = {
  __typename?: 'UsersPermissionsRoleConnectionType';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsRoleConnection>;
};

export type RoleInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Scalars['ID']>>>;
  users?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditRoleInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Scalars['ID']>>>;
  users?: Maybe<Array<Maybe<Scalars['ID']>>>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateRoleInput = {
  data?: Maybe<RoleInput>;
};

export type CreateRolePayload = {
  __typename?: 'createRolePayload';
  role?: Maybe<UsersPermissionsRole>;
};

export type UpdateRoleInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditRoleInput>;
};

export type UpdateRolePayload = {
  __typename?: 'updateRolePayload';
  role?: Maybe<UsersPermissionsRole>;
};

export type DeleteRoleInput = {
  where?: Maybe<InputId>;
};

export type DeleteRolePayload = {
  __typename?: 'deleteRolePayload';
  role?: Maybe<UsersPermissionsRole>;
};

export type UsersPermissionsUser = {
  __typename?: 'UsersPermissionsUser';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
  email: Scalars['String'];
  provider?: Maybe<Scalars['String']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  blocked?: Maybe<Scalars['Boolean']>;
  role?: Maybe<UsersPermissionsRole>;
};

export type UsersPermissionsUserConnection = {
  __typename?: 'UsersPermissionsUserConnection';
  values?: Maybe<Array<Maybe<UsersPermissionsUser>>>;
  groupBy?: Maybe<UsersPermissionsUserGroupBy>;
  aggregate?: Maybe<UsersPermissionsUserAggregator>;
};

export type UsersPermissionsUserAggregator = {
  __typename?: 'UsersPermissionsUserAggregator';
  count?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type UsersPermissionsUserGroupBy = {
  __typename?: 'UsersPermissionsUserGroupBy';
  id?: Maybe<Array<Maybe<UsersPermissionsUserConnectionId>>>;
  _id?: Maybe<Array<Maybe<UsersPermissionsUserConnection_Id>>>;
  createdAt?: Maybe<Array<Maybe<UsersPermissionsUserConnectionCreatedAt>>>;
  updatedAt?: Maybe<Array<Maybe<UsersPermissionsUserConnectionUpdatedAt>>>;
  username?: Maybe<Array<Maybe<UsersPermissionsUserConnectionUsername>>>;
  email?: Maybe<Array<Maybe<UsersPermissionsUserConnectionEmail>>>;
  provider?: Maybe<Array<Maybe<UsersPermissionsUserConnectionProvider>>>;
  confirmed?: Maybe<Array<Maybe<UsersPermissionsUserConnectionConfirmed>>>;
  blocked?: Maybe<Array<Maybe<UsersPermissionsUserConnectionBlocked>>>;
  role?: Maybe<Array<Maybe<UsersPermissionsUserConnectionRole>>>;
};

export type UsersPermissionsUserConnectionId = {
  __typename?: 'UsersPermissionsUserConnectionId';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnection_Id = {
  __typename?: 'UsersPermissionsUserConnection_id';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionCreatedAt = {
  __typename?: 'UsersPermissionsUserConnectionCreatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionUpdatedAt = {
  __typename?: 'UsersPermissionsUserConnectionUpdatedAt';
  key?: Maybe<Scalars['DateTime']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionUsername = {
  __typename?: 'UsersPermissionsUserConnectionUsername';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionEmail = {
  __typename?: 'UsersPermissionsUserConnectionEmail';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionProvider = {
  __typename?: 'UsersPermissionsUserConnectionProvider';
  key?: Maybe<Scalars['String']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionConfirmed = {
  __typename?: 'UsersPermissionsUserConnectionConfirmed';
  key?: Maybe<Scalars['Boolean']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionBlocked = {
  __typename?: 'UsersPermissionsUserConnectionBlocked';
  key?: Maybe<Scalars['Boolean']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UsersPermissionsUserConnectionRole = {
  __typename?: 'UsersPermissionsUserConnectionRole';
  key?: Maybe<Scalars['ID']>;
  connection?: Maybe<UsersPermissionsUserConnection>;
};

export type UserInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  provider?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  resetPasswordToken?: Maybe<Scalars['String']>;
  confirmationToken?: Maybe<Scalars['String']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  blocked?: Maybe<Scalars['Boolean']>;
  role?: Maybe<Scalars['ID']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type EditUserInput = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  resetPasswordToken?: Maybe<Scalars['String']>;
  confirmationToken?: Maybe<Scalars['String']>;
  confirmed?: Maybe<Scalars['Boolean']>;
  blocked?: Maybe<Scalars['Boolean']>;
  role?: Maybe<Scalars['ID']>;
  created_by?: Maybe<Scalars['ID']>;
  updated_by?: Maybe<Scalars['ID']>;
};

export type CreateUserInput = {
  data?: Maybe<UserInput>;
};

export type CreateUserPayload = {
  __typename?: 'createUserPayload';
  user?: Maybe<UsersPermissionsUser>;
};

export type UpdateUserInput = {
  where?: Maybe<InputId>;
  data?: Maybe<EditUserInput>;
};

export type UpdateUserPayload = {
  __typename?: 'updateUserPayload';
  user?: Maybe<UsersPermissionsUser>;
};

export type DeleteUserInput = {
  where?: Maybe<InputId>;
};

export type DeleteUserPayload = {
  __typename?: 'deleteUserPayload';
  user?: Maybe<UsersPermissionsUser>;
};

export type ComponentSectionsHero = {
  __typename?: 'ComponentSectionsHero';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  title: Scalars['String'];
};

export type ComponentSectionsHeroInput = {
  title: Scalars['String'];
};

export type EditComponentSectionsHeroInput = {
  id?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
};

export type ComponentSharedSeo = {
  __typename?: 'ComponentSharedSeo';
  id: Scalars['ID'];
  _id: Scalars['ID'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
  shareImage?: Maybe<UploadFile>;
};

export type ComponentSharedSeoInput = {
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
  shareImage?: Maybe<Scalars['ID']>;
};

export type EditComponentSharedSeoInput = {
  id?: Maybe<Scalars['ID']>;
  metaTitle?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  shareImage?: Maybe<Scalars['ID']>;
};

export type Morph = UsersPermissionsMe | UsersPermissionsMeRole | UsersPermissionsLoginPayload | UserPermissionsPasswordPayload | Article | ArticleConnection | ArticleAggregator | ArticleGroupBy | ArticleConnectionId | ArticleConnection_Id | ArticleConnectionCreatedAt | ArticleConnectionUpdatedAt | ArticleConnectionTitle | ArticleConnectionDescription | ArticleConnectionContent | ArticleConnectionPublishedAt | ArticleConnectionStatus | ArticleConnectionSlug | ArticleConnectionCategory | ArticleConnectionImage | ArticleConnectionAuthor | CreateArticlePayload | UpdateArticlePayload | DeleteArticlePayload | Category | CategoryConnection | CategoryAggregator | CategoryGroupBy | CategoryConnectionId | CategoryConnection_Id | CategoryConnectionCreatedAt | CategoryConnectionUpdatedAt | CategoryConnectionName | CategoryConnectionSlug | CreateCategoryPayload | UpdateCategoryPayload | DeleteCategoryPayload | Global | UpdateGlobalPayload | DeleteGlobalPayload | Homepage | UpdateHomepagePayload | DeleteHomepagePayload | Tag | TagConnection | TagAggregator | TagGroupBy | TagConnectionId | TagConnection_Id | TagConnectionCreatedAt | TagConnectionUpdatedAt | TagConnectionName | TagConnectionSlug | CreateTagPayload | UpdateTagPayload | DeleteTagPayload | Writer | WriterConnection | WriterAggregator | WriterGroupBy | WriterConnectionId | WriterConnection_Id | WriterConnectionCreatedAt | WriterConnectionUpdatedAt | WriterConnectionName | WriterConnectionPicture | WriterConnectionEmail | CreateWriterPayload | UpdateWriterPayload | DeleteWriterPayload | UploadFile | UploadFileConnection | UploadFileAggregator | UploadFileAggregatorSum | UploadFileAggregatorAvg | UploadFileAggregatorMin | UploadFileAggregatorMax | UploadFileGroupBy | UploadFileConnectionId | UploadFileConnection_Id | UploadFileConnectionCreatedAt | UploadFileConnectionUpdatedAt | UploadFileConnectionName | UploadFileConnectionAlternativeText | UploadFileConnectionCaption | UploadFileConnectionWidth | UploadFileConnectionHeight | UploadFileConnectionFormats | UploadFileConnectionHash | UploadFileConnectionExt | UploadFileConnectionMime | UploadFileConnectionSize | UploadFileConnectionUrl | UploadFileConnectionPreviewUrl | UploadFileConnectionProvider | UploadFileConnectionProvider_Metadata | DeleteFilePayload | UsersPermissionsPermission | UsersPermissionsRole | UsersPermissionsRoleConnection | UsersPermissionsRoleAggregator | UsersPermissionsRoleGroupBy | UsersPermissionsRoleConnectionId | UsersPermissionsRoleConnection_Id | UsersPermissionsRoleConnectionName | UsersPermissionsRoleConnectionDescription | UsersPermissionsRoleConnectionType | CreateRolePayload | UpdateRolePayload | DeleteRolePayload | UsersPermissionsUser | UsersPermissionsUserConnection | UsersPermissionsUserAggregator | UsersPermissionsUserGroupBy | UsersPermissionsUserConnectionId | UsersPermissionsUserConnection_Id | UsersPermissionsUserConnectionCreatedAt | UsersPermissionsUserConnectionUpdatedAt | UsersPermissionsUserConnectionUsername | UsersPermissionsUserConnectionEmail | UsersPermissionsUserConnectionProvider | UsersPermissionsUserConnectionConfirmed | UsersPermissionsUserConnectionBlocked | UsersPermissionsUserConnectionRole | CreateUserPayload | UpdateUserPayload | DeleteUserPayload | ComponentSectionsHero | ComponentSharedSeo;

export type InputId = {
  id: Scalars['ID'];
};

export enum PublicationState {
  Live = 'LIVE',
  Preview = 'PREVIEW'
}

export type AdminUser = {
  __typename?: 'AdminUser';
  id: Scalars['ID'];
  username?: Maybe<Scalars['String']>;
  firstname: Scalars['String'];
  lastname: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  article?: Maybe<Article>;
  articles?: Maybe<Array<Maybe<Article>>>;
  articlesConnection?: Maybe<ArticleConnection>;
  category?: Maybe<Category>;
  categories?: Maybe<Array<Maybe<Category>>>;
  categoriesConnection?: Maybe<CategoryConnection>;
  global?: Maybe<Global>;
  homepage?: Maybe<Homepage>;
  tag?: Maybe<Tag>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  tagsConnection?: Maybe<TagConnection>;
  writer?: Maybe<Writer>;
  writers?: Maybe<Array<Maybe<Writer>>>;
  writersConnection?: Maybe<WriterConnection>;
  files?: Maybe<Array<Maybe<UploadFile>>>;
  filesConnection?: Maybe<UploadFileConnection>;
  role?: Maybe<UsersPermissionsRole>;
  /** Retrieve all the existing roles. You can't apply filters on this query. */
  roles?: Maybe<Array<Maybe<UsersPermissionsRole>>>;
  rolesConnection?: Maybe<UsersPermissionsRoleConnection>;
  user?: Maybe<UsersPermissionsUser>;
  users?: Maybe<Array<Maybe<UsersPermissionsUser>>>;
  usersConnection?: Maybe<UsersPermissionsUserConnection>;
  me?: Maybe<UsersPermissionsMe>;
};


export type QueryArticleArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryArticlesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryArticlesConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryCategoriesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryCategoriesConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryGlobalArgs = {
  publicationState?: Maybe<PublicationState>;
};


export type QueryHomepageArgs = {
  publicationState?: Maybe<PublicationState>;
};


export type QueryTagArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryTagsArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryTagsConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryWriterArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryWritersArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryWritersConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryFilesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryFilesConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryRoleArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryRolesArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryRolesConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
  publicationState?: Maybe<PublicationState>;
};


export type QueryUsersArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
  publicationState?: Maybe<PublicationState>;
};


export type QueryUsersConnectionArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createArticle?: Maybe<CreateArticlePayload>;
  updateArticle?: Maybe<UpdateArticlePayload>;
  deleteArticle?: Maybe<DeleteArticlePayload>;
  createCategory?: Maybe<CreateCategoryPayload>;
  updateCategory?: Maybe<UpdateCategoryPayload>;
  deleteCategory?: Maybe<DeleteCategoryPayload>;
  updateGlobal?: Maybe<UpdateGlobalPayload>;
  deleteGlobal?: Maybe<DeleteGlobalPayload>;
  updateHomepage?: Maybe<UpdateHomepagePayload>;
  deleteHomepage?: Maybe<DeleteHomepagePayload>;
  createTag?: Maybe<CreateTagPayload>;
  updateTag?: Maybe<UpdateTagPayload>;
  deleteTag?: Maybe<DeleteTagPayload>;
  createWriter?: Maybe<CreateWriterPayload>;
  updateWriter?: Maybe<UpdateWriterPayload>;
  deleteWriter?: Maybe<DeleteWriterPayload>;
  /** Delete one file */
  deleteFile?: Maybe<DeleteFilePayload>;
  /** Create a new role */
  createRole?: Maybe<CreateRolePayload>;
  /** Update an existing role */
  updateRole?: Maybe<UpdateRolePayload>;
  /** Delete an existing role */
  deleteRole?: Maybe<DeleteRolePayload>;
  /** Create a new user */
  createUser?: Maybe<CreateUserPayload>;
  /** Update an existing user */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Delete an existing user */
  deleteUser?: Maybe<DeleteUserPayload>;
  upload: UploadFile;
  multipleUpload: Array<Maybe<UploadFile>>;
  updateFileInfo: UploadFile;
  login: UsersPermissionsLoginPayload;
  register: UsersPermissionsLoginPayload;
  forgotPassword?: Maybe<UserPermissionsPasswordPayload>;
  resetPassword?: Maybe<UsersPermissionsLoginPayload>;
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>;
};


export type MutationCreateArticleArgs = {
  input?: Maybe<CreateArticleInput>;
};


export type MutationUpdateArticleArgs = {
  input?: Maybe<UpdateArticleInput>;
};


export type MutationDeleteArticleArgs = {
  input?: Maybe<DeleteArticleInput>;
};


export type MutationCreateCategoryArgs = {
  input?: Maybe<CreateCategoryInput>;
};


export type MutationUpdateCategoryArgs = {
  input?: Maybe<UpdateCategoryInput>;
};


export type MutationDeleteCategoryArgs = {
  input?: Maybe<DeleteCategoryInput>;
};


export type MutationUpdateGlobalArgs = {
  input?: Maybe<UpdateGlobalInput>;
};


export type MutationUpdateHomepageArgs = {
  input?: Maybe<UpdateHomepageInput>;
};


export type MutationCreateTagArgs = {
  input?: Maybe<CreateTagInput>;
};


export type MutationUpdateTagArgs = {
  input?: Maybe<UpdateTagInput>;
};


export type MutationDeleteTagArgs = {
  input?: Maybe<DeleteTagInput>;
};


export type MutationCreateWriterArgs = {
  input?: Maybe<CreateWriterInput>;
};


export type MutationUpdateWriterArgs = {
  input?: Maybe<UpdateWriterInput>;
};


export type MutationDeleteWriterArgs = {
  input?: Maybe<DeleteWriterInput>;
};


export type MutationDeleteFileArgs = {
  input?: Maybe<DeleteFileInput>;
};


export type MutationCreateRoleArgs = {
  input?: Maybe<CreateRoleInput>;
};


export type MutationUpdateRoleArgs = {
  input?: Maybe<UpdateRoleInput>;
};


export type MutationDeleteRoleArgs = {
  input?: Maybe<DeleteRoleInput>;
};


export type MutationCreateUserArgs = {
  input?: Maybe<CreateUserInput>;
};


export type MutationUpdateUserArgs = {
  input?: Maybe<UpdateUserInput>;
};


export type MutationDeleteUserArgs = {
  input?: Maybe<DeleteUserInput>;
};


export type MutationUploadArgs = {
  refId?: Maybe<Scalars['ID']>;
  ref?: Maybe<Scalars['String']>;
  field?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  info?: Maybe<FileInfoInput>;
  file: Scalars['Upload'];
};


export type MutationMultipleUploadArgs = {
  refId?: Maybe<Scalars['ID']>;
  ref?: Maybe<Scalars['String']>;
  field?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  files: Array<Maybe<Scalars['Upload']>>;
};


export type MutationUpdateFileInfoArgs = {
  id: Scalars['ID'];
  info: FileInfoInput;
};


export type MutationLoginArgs = {
  input: UsersPermissionsLoginInput;
};


export type MutationRegisterArgs = {
  input: UsersPermissionsRegisterInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  code: Scalars['String'];
};


export type MutationEmailConfirmationArgs = {
  confirmation: Scalars['String'];
};







export type AllArticlesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllArticlesQuery = (
  { __typename?: 'Query' }
  & { articles?: Maybe<Array<Maybe<(
    { __typename?: 'Article' }
    & Pick<Article, 'id' | 'slug' | 'publishedAt' | 'title' | 'description'>
    & { image?: Maybe<(
      { __typename?: 'UploadFile' }
      & Pick<UploadFile, 'url' | 'alternativeText' | 'formats'>
    )>, tags?: Maybe<Array<Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'name' | 'slug'>
    )>>> }
  )>>> }
);

export type FindArticleBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type FindArticleBySlugQuery = (
  { __typename?: 'Query' }
  & { articles?: Maybe<Array<Maybe<(
    { __typename?: 'Article' }
    & Pick<Article, 'id' | 'title' | 'description' | 'publishedAt' | 'content'>
    & { image?: Maybe<(
      { __typename?: 'UploadFile' }
      & Pick<UploadFile, 'url' | 'height' | 'width' | 'alternativeText' | 'formats'>
    )>, tags?: Maybe<Array<Maybe<(
      { __typename?: 'Tag' }
      & Pick<Tag, 'name' | 'slug'>
    )>>> }
  )>>> }
);

export type GlobalQueryVariables = Exact<{ [key: string]: never; }>;


export type GlobalQuery = (
  { __typename?: 'Query' }
  & { global?: Maybe<(
    { __typename?: 'Global' }
    & Pick<Global, 'copyrightNotice' | 'siteName'>
  )> }
);


export const AllArticlesDocument = gql`
    query AllArticles {
  articles {
    id
    slug
    publishedAt
    title
    description
    image {
      url
      alternativeText
      formats
    }
    tags {
      name
      slug
    }
  }
}
    `;

/**
 * __useAllArticlesQuery__
 *
 * To run a query within a React component, call `useAllArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllArticlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllArticlesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllArticlesQuery(baseOptions?: Apollo.QueryHookOptions<AllArticlesQuery, AllArticlesQueryVariables>) {
        return Apollo.useQuery<AllArticlesQuery, AllArticlesQueryVariables>(AllArticlesDocument, baseOptions);
      }
export function useAllArticlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllArticlesQuery, AllArticlesQueryVariables>) {
          return Apollo.useLazyQuery<AllArticlesQuery, AllArticlesQueryVariables>(AllArticlesDocument, baseOptions);
        }
export type AllArticlesQueryHookResult = ReturnType<typeof useAllArticlesQuery>;
export type AllArticlesLazyQueryHookResult = ReturnType<typeof useAllArticlesLazyQuery>;
export type AllArticlesQueryResult = Apollo.QueryResult<AllArticlesQuery, AllArticlesQueryVariables>;
export const FindArticleBySlugDocument = gql`
    query findArticleBySlug($slug: String!) {
  articles(where: {slug: $slug}) {
    id
    title
    description
    publishedAt
    content
    image {
      url
      height
      width
      alternativeText
      formats
    }
    tags {
      name
      slug
    }
  }
}
    `;

/**
 * __useFindArticleBySlugQuery__
 *
 * To run a query within a React component, call `useFindArticleBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindArticleBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindArticleBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useFindArticleBySlugQuery(baseOptions: Apollo.QueryHookOptions<FindArticleBySlugQuery, FindArticleBySlugQueryVariables>) {
        return Apollo.useQuery<FindArticleBySlugQuery, FindArticleBySlugQueryVariables>(FindArticleBySlugDocument, baseOptions);
      }
export function useFindArticleBySlugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindArticleBySlugQuery, FindArticleBySlugQueryVariables>) {
          return Apollo.useLazyQuery<FindArticleBySlugQuery, FindArticleBySlugQueryVariables>(FindArticleBySlugDocument, baseOptions);
        }
export type FindArticleBySlugQueryHookResult = ReturnType<typeof useFindArticleBySlugQuery>;
export type FindArticleBySlugLazyQueryHookResult = ReturnType<typeof useFindArticleBySlugLazyQuery>;
export type FindArticleBySlugQueryResult = Apollo.QueryResult<FindArticleBySlugQuery, FindArticleBySlugQueryVariables>;
export const GlobalDocument = gql`
    query Global {
  global {
    copyrightNotice
    siteName
  }
}
    `;

/**
 * __useGlobalQuery__
 *
 * To run a query within a React component, call `useGlobalQuery` and pass it any options that fit your needs.
 * When your component renders, `useGlobalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGlobalQuery({
 *   variables: {
 *   },
 * });
 */
export function useGlobalQuery(baseOptions?: Apollo.QueryHookOptions<GlobalQuery, GlobalQueryVariables>) {
        return Apollo.useQuery<GlobalQuery, GlobalQueryVariables>(GlobalDocument, baseOptions);
      }
export function useGlobalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GlobalQuery, GlobalQueryVariables>) {
          return Apollo.useLazyQuery<GlobalQuery, GlobalQueryVariables>(GlobalDocument, baseOptions);
        }
export type GlobalQueryHookResult = ReturnType<typeof useGlobalQuery>;
export type GlobalLazyQueryHookResult = ReturnType<typeof useGlobalLazyQuery>;
export type GlobalQueryResult = Apollo.QueryResult<GlobalQuery, GlobalQueryVariables>;