var initTable = `
<table id="appListTable">
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
var script;

function changeSwitch(index,job){
    var location = index.split('.');
    var i = location[0], j = location[1];
    if(job == 'on'){
        if(script[i].groups[j].hasOwnProperty('enable') == true){
            delete script[i].groups[j].enable;
            document.getElementById(index).style.color = 'green';
            alert('已打开');
        }
        else alert('该规则已经打开了');
    }
    else if(job == 'off'){
        if(script[i].groups[j].hasOwnProperty('enable') == true) alert('该规则已经关闭了');
        else{
            script[i].groups[j]['enable'] = 'false';
            document.getElementById(index).style.color = 'red';
            alert('已关闭');
        }
    }
};

function search(){
    var target = document.getElementById('name').value;
    var same, include = 0;
    var preferences, secondaryOptions = [];
    if(target == '') getDetails();
    else{
        document.getElementById('appList').innerHTML = initTable;
        eachAppRules = '';
        for(var i in script){
            if(script[i].name.includes(target) == true || script[i].id.includes(target) == true){
                if(script[i].name == target || script[i].id == target){
                    preferences.push(i);
                    same += 1;
                }
                else{
                    secondaryOptions.push(i);
                    include += 1;
                }
            }
        }
        var packageName, appName, ruleName, desc;
        for(var i in preferences){
            packageName = script[preferences[i]].id;
            appName = script[preferences[i]].name;
            for(var j in script[preferences[i]].groups){
                ruleName = script[preferences[i]].groups[j].name;
                if(script[i].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                else style = 'color: green;';
                if(script[preferences[i]].groups[j].hasOwnProperty('desc') == true) desc = script[preferences[i]].groups[j].desc;
                else desc = '该规则暂无描述';
                eachAppRules += `
                <tr>
                    <td>${appName}</td>
                    <td>${packageName}</td>
                    <td id="${String(i) + '.' + String(j)}" style="${style}">${ruleName}</td>
                    <td>${desc}</td>
                    <td>
                        <button onclick="changeSwitch('${String(i) + '.' + String(j)}','on');">打开</button>
                        <button onclick="changeSwitch('${String(i) + '.' + String(j)}','off');">关闭</button>
                        <button onclick="output('${String(i) + '.' + String(j)}')">导出该规则</button>
                    </td>
                </tr>`;
            };
        }
        for(var i in secondaryOptions){
            packageName = script[secondaryOptions[i]].id;
            appName = script[secondaryOptions[i]].name;
            for(var j in script[secondaryOptions[i]].groups){
                ruleName = script[secondaryOptions[i]].groups[j].name;
                if(script[i].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                else style = 'color: green;';
                if(script[secondaryOptions[i]].groups[j].hasOwnProperty('desc') == true) desc = script[secondaryOptions[i]].groups[j].desc;
                else desc = '该规则暂无描述';
                eachAppRules += `
                <tr>
                    <td>${appName}</td>
                    <td>${packageName}</td>
                    <td id="${String(i) + '.' + String(j)}" style="${style}">${ruleName}</td>
                    <td>${desc}</td>
                    <td>
                        <button onclick="changeSwitch('${String(i) + '.' + String(j)}','on');">打开</button>
                        <button onclick="changeSwitch('${String(i) + '.' + String(j)}','off');">关闭</button>
                        <button onclick="output('${String(i) + '.' + String(j)}')">导出该规则</button>
                    </td>
                </tr>`;
            };
        }
        var ruleList = document.querySelector('tbody');
        ruleList.innerHTML = eachAppRules;
    }
};

function output(type){
    if(type == 'all'){
        navigator.clipboard.writeText(JSON5.stringify(script).slice(1,-1)).then(() => {
            alert('已复制到剪切板');
        });
    }
    else{
        var location = type.split('.');
        var i = location[0], j = location[1];
        navigator.clipboard.writeText(JSON5.stringify(script[i].groups[j])).then(() => {
            alert('已复制到剪切板');
        });
    }
};

function getDetails(){
    axios.get('../gkd.json5').then(function(data){
        data = JSON5.parse(data.data);
        script = data.apps;
        document.getElementById('subVer').innerHTML = '<span>订阅版本：' + data.version + '</span>';
        document.getElementById('appList').innerHTML = initTable;
        var eachAppRules = '';
        for(var i in data.apps){
            var packageName, appName, ruleName, desc, style;
            packageName = data.apps[i].id;
            appName = data.apps[i].name;
            for(var j in data.apps[i].groups){
                ruleName = data.apps[i].groups[j].name;
                if(script[i].groups[j].hasOwnProperty('enable') == true) style = 'color: red;';
                else style = 'color: green;';
                if(data.apps[i].groups[j].hasOwnProperty('desc') == true) desc = data.apps[i].groups[j].desc;
                else desc = '该规则暂无描述';
                eachAppRules += `
                <tr>
                    <td>${appName}</td>
                    <td>${packageName}</td>
                    <td id="${String(i) + '.' + String(j)}" style="${style}">${ruleName}</td>
                    <td>${desc}</td>
                    <td>
                        <button onclick="changeSwitch('${String(i) + '.' + String(j)}','on');">打开</button>
                        <button onclick="changeSwitch('${String(i) + '.' + String(j)}','off');">关闭</button>
                        <button onclick="output('${String(i) + '.' + String(j)}')">导出该规则</button>
                    </td>
                </tr>`;
            };
        };
        var ruleList = document.querySelector('tbody');
        ruleList.innerHTML = eachAppRules;
    });
};