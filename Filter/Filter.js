/* 미사용 확률 多 */

var Filter = () => {};

Filter.WorkSpaceCheck (workspace) => {

    let workspace = workspace;
    if(!workspace || workspace === undefined){

        return false;
    }
    else{

        return true;
    }
}

module.exports = Filter;
