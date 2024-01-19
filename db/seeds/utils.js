const db = require("../connection")

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkValidTopic = (topic) => {
  if(topic !== undefined){
  return db.query("SELECT * FROM topics WHERE slug = $1", [topic])
  .then((result) => {
  if (result.rows.length === 0){
    return Promise.reject({status: 404, msg: 'Topic does not exist'})
       }
    });
  } else {
     return Promise.resolve()
  }
}

exports.checkValidColumn = (sort_by) => {
  if (sort_by !== 'created_at'){
    return db.query("SELECT * FROM information_schema.columns WHERE table_name = 'articles' and column_name = $1", [sort_by])
    .then((result) => {
      if (result.rows.length === 0){
        return Promise.reject({status: 404, msg: 'Column does not exist'})
      }
    });
  } else {
     return Promise.resolve()
  }
}

