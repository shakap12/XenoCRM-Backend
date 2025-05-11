const buildQuery = (filters) => {
  const query = {};

  if (!filters || filters.length === 0) {
    return query;
  }

  const andConditions = [];
  const orConditions = [];

  filters.forEach((filter) => {
    const field = filter.field;
    const operator = filter.operator;
    const value = field == 'lastVisit' ? parseDateString(filter.value) : filter.value;
    const logicalOperator = filter.logicalOperator;


    let condition;
    switch (operator) {
      case "eq":
        condition = { [field]: value };
        break;
      case "gt":
        condition = { [field]: { $gt: value } };
        break;
      case "lt":
        condition = { [field]: { $lt: value } };
        break;
      case "gte":
        condition = { [field]: { $gte: value } };
        break;
      case "lte":
        condition = { [field]: { $lte: value } };
        break;
      case "ne":
        condition = { [field]: { $ne: value } };
        break;
      case "in":
        condition = { [field]: { $in: value } };
        break;
      case "nin":
        condition = { [field]: { $nin: value } };
        break;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }

    if (logicalOperator === "AND") {
      andConditions.push(condition);
    } else if (logicalOperator === "OR") {
      orConditions.push(condition);
    }
  });

  if (andConditions.length > 0) {
    if (orConditions.length > 0) {
      query.$or = [
        { $or: orConditions },
        { $and: andConditions }
      ]
    } else {
      query.$and = andConditions;
    }
  } else {
    if (orConditions.length > 0) {
      query.$or = orConditions;
    }
  }


  return query;
};

const parseDateString = (dateString) => {
  const [month, day, year] = dateString.split('/');
  const date = new Date(year, month - 1, day);
  return date;
};

module.exports = { buildQuery };
