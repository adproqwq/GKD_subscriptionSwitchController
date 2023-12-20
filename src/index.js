/*function getInput(){
    var appName = document.getElementById('name').value;
};
*/
function changeSwitch(index,job){
    var location = index.split('.');
    var i = location[0], j = location[1];
    script = JSON.parse(script);
    if(job == 'on'){
        if(script[i].groups[j].hasOwnProperty('enable') == true) delete script[i].groups[j].enable;
        else alert('该规则已经打开了');
    }
    else if(job == 'off'){
        if(script[i].groups[j].hasOwnProperty('enable') == true) alert('该规则已经关闭了');
        else script[i].groups[j]['enable'] = 'false';
    }
};

function output(){
    navigator.clipboard.writeText(script).then(() => {
        alert('已复制到剪切板');
    });
};

var script;
axios.get('/adpro/gkd/gkd.json5').then(function(data){
    script = data.data.apps;
    var initTable = `
    <table border="1">
        <thead>
            <tr>
                <th>应用名</th>
                <th>包名</th>
                <th>规则名</th>
                <th>规则描述</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>`;
    document.getElementById('subVer').innerHTML = '<span>订阅版本：' + data.data.version + '</span>';
    document.getElementById('appList').innerHTML = initTable;
    var eachAppRules = '';
    for(var i in data.data.apps){
        var packageName, appName, ruleName, desc;
        packageName = data.data.apps[i].id;
        appName = data.data.apps[i].name;
        for(var j in data.data.apps[i].groups){
            ruleName = data.data.apps[i].groups[j].name;
            if(data.data.apps[i].groups[j].hasOwnProperty('desc') == true) desc = data.data.apps[i].groups[j].desc;
            else desc = '该规则暂无描述';
            eachAppRules += `
            <tr>
                <td>${appName}</td>
                <td>${packageName}</td>
                <td>${ruleName}</td>
                <td>${desc}</td>
                <td>
                    <button onclick="changeSwitch('${String(i) + '.' + String(j)}','on');">打开</button>
                    <button onclick="changeSwitch('${String(i) + '.' + String(j)}','off');">关闭</button>
                </td>
            </tr>`;
        };
    };
    var ruleList = document.querySelector('tbody');
    ruleList.innerHTML = eachAppRules;
});