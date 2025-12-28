# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type Member {
  _id: String!
  memberType: MemberType!
  memberStatus: MemberStatus!
  memberAuthType: MemberAuthType!
  memberPhone: String!
  memberNick: String!
  memberFullName: String
  memberImage: String!
  memberAdress: String
  memberDesc: String
  memberProperties: Int!
  memberArticles: Int!
  memberFollowers: Int!
  memberFollowings: Int!
  memberPoints: Int!
  memberLikes: Int!
  memberViews: Int!
  memberComments: Int!
  memberRank: Int!
  memberWarnings: Int!
  memberBlocks: Int!
  deletedAt: DateTime
  updatedAt: DateTime!
}

enum MemberType {
  USER
  AGENT
  ADMIN
}

enum MemberStatus {
  ACTIVE
  BLOCK
  DELETE
}

enum MemberAuthType {
  PHONE
  EMAIL
  TELEGRAM
}

"""
A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
"""
scalar DateTime

type Query {
  sayHello: String!
  getMember: String!
}

type Mutation {
  signup(input: MemberInput!): Member!
  login(input: LoginInput!): Member!
  updateMember: String!
}

input MemberInput {
  memberNick: String!
  memberPassword: String!
  memberPhone: String!
  memberType: MemberType
  MemberAuthType: MemberAuthType
}

input LoginInput {
  memberNick: String!
  memberPassword: String!
}