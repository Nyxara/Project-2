const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let CharModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CharSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  level: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  class: {
    type: String,
    trim: true,
  },

  race: {
    type: String,
    trim: true,
  },

  ref: {
    type: String,
    trim: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

CharSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  level: doc.level,
  class: doc.class,
  race: doc.race,
  ref: doc.ref,
});

CharSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CharModel.find(search).select('name level class race ref').lean().exec(callback);
};

CharModel = mongoose.model('Char', CharSchema);

module.exports.CharModel = CharModel;
module.exports.CharSchema = CharSchema;
