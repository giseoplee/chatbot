var Exception = () => {};

//desc : error check
Exception.errorHandlingFunc = (error) => {

  if (error == 'SequelizeUniqueConstraintError: Validation error') { // column is not unique
    console.log('Column is not unique : ' + error);
    return false;
  } else if (error.indexOf('Data too long for column') >= 0) { // datasize를 초과했을 경우
    var column = error.split('column');
    column = column[1].split('at');
    console.log(column[0] + 'too long : ' + error);
    return false;
  } else if (error.indexOf('SequelizeDatabaseError: Incorrect ') >= 0 &&
    error.indexOf('value: ') >= 0) { //datatype in not correct
    var column = error.split('Incorrect ');
    column = column[1].split('value:');
    console.log(column[0] + 'is incorrect datatype : ' + error);
    return false;
  } else {
    console.log('insert error : ' + error);
    return false;
  }

  return true;
}

//ERROR : primaryKey in null
Exception.primarykeyCheck = (pk, res) => {
  //ERROR : primaryKey in null
  if (pk.userId == null) {

    console.log('PRIMARYKEY is null!! : ' + pk.userId);
    return false;

  }

  return true;
}

//desc : data length check
Exception.redisDataLengthCheck =  (length, res) => {
  if (length <= 0) { // redis is empty

    console.log('empty memory');
    return false;

  }
  return true;
}

module.exports = Exception;
