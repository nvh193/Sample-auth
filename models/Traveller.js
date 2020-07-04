import mongoose from 'mongoose'
import * as Constants from './../lib/constants'
import _ from 'lodash'
import { transformVietnamese } from './../lib/utils'
const Schema = mongoose.Schema

const TravellerSchema = new Schema(
  {
    userName: {
      type: String,
      lowercase: true
    },
    fullName: {
      type: String
    },
    fullNameSort: {
      type: String
    },
    dob: {
      type: Date
    },
    gender: {
      type: String,
      enum: _.values(Constants.GENDER)
    },
    profile: {
      type: Schema.Types.Mixed
    },
    email: {
      type: String,
      unique: true,
      index: true
    },
    password: {
      type: String
    },
    phone: {
      type: String
    },
    facebookId: {
      type: String
    },
    career: {
      type: String
    },
    address: {
      type: String
    },
    aboutMe: {
      type: String
    },
    googleId: {
      type: String
    },
    avatar: {
      type: String
    },
    facebook: String,
    instagram: String,
    twitter: String,
    website: String,
    interests: {
      type: [{ type: String }],
      default: []
    },
    status: {
      type: Number,
      default: Constants.TRAVELLER_STATUS.Active
    },
    presence: {
      type: Boolean,
      default: false
    },
    presenceAt: {
      type: Date,
      default: Date.now
    },
    activedAt: {
      type: Date
    },
    statistic: {
      type: {
        points: {
          type: Number,
          min: 0,
          default: Constants.BONUS_REGISTER
        },
        redeemPoints: {
          type: Number,
          min: 0,
          default: 0
        },
        followers: {
          type: Number,
          min: 0,
          default: 0
        },
        followings: {
          type: Number,
          min: 0,
          default: 0
        },
        friends: {
          type: Number,
          min: 0,
          default: 0
        },
        trips: {
          type: Number,
          min: 0,
          default: 0
        },
        checkIns: {
          type: Number,
          min: 0,
          default: 0
        }
      },
      default: {
        points: Constants.BONUS_REGISTER,
        redeemPoints: 0,
        followers: 0,
        followings: 0,
        friends: 0,
        trips: 0,
        checkIns: 0
      }
    },
    registeredFrom: {
      type: String
    },
    provider: {
      type: String,
      default: Constants.PROVIDER.Thanktriips
    },
    profileReliability: {
      type: Number,
      default: 0
    },
    lang: {
      type: String,
      enum: _.values(Constants.LANGUAGE),
      default: Constants.LANGUAGE.vi
    },
    gameInfo: {
      type: {
        roundOne: {
          type: Number,
          default: 0
        },
        roundTwo: {
          type: Number,
          default: 0
        },
        roundThree: {
          type: Number,
          default: 0
        }
      },
      default: {
        roundOne: 0,
        roundTwo: 0,
        roundThree: 0
      }
    },
    gameResults: {
      type: {
        roundOne: {
          score: Number,
          completedTime: Number
        },
        roundTwo: {
          score: Number,
          completedTime: Number
        },
        roundThree: {
          score: Number,
          completedTime: Number
        }
      },
      default: {
        roundOne: { score: 0, completedTime: 100000 },
        roundTwo: { score: 0, completedTime: 100000 },
        roundThree: { score: 0, completedTime: 120000 }
      }
    },
    turnLimit: {
      type: Number,
      default: 2
    },
    coverImage: {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    },
    referralCode: String,
    referralBy: {
      type: Schema.Types.ObjectId,
      ref: 'Traveller'
    }
  },
  {
    collection: 'Traveller',
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(val, ret) {
        delete ret.__v
        delete ret.password
      }
    }
  }
)

TravellerSchema.pre('save', function(next) {
  next()
})

TravellerSchema.index({
  fullName: 'text',
  fullNameSort: 'text',
  email: 'text',
  phone: 'text',
  userName: 'text'
})

TravellerSchema.virtual('hasPassword').get(function() {
  return this.password ? true : false
})

export default mongoose.model('Traveller', TravellerSchema)
