import { rollup, sum } from 'd3-array';
import { keepKeys, unpack } from './helper';

function groupData(initData) {
    const keys = ['Month', 'Type', 'Loans'];
    const data = keepKeys(initData.data, keys);
    return Array.from(
        rollup(
            data,
            d => sum(d.map(d => +d.Loans)),
            d => d.Type,
            d => d.Month
        ),
        ([Type, m]) => ({
            Type, data: Array.from(m, ([Month, Loans]) => ({ Month, Loans }))
        })
    );
}
function traces(grouped) {
    return grouped.map(g => ({
        x: unpack(g.data, 'Month'),
        y: unpack(g.data, 'Loans'),
        type: 'scatter',
        mode: 'lines',
        name: g.Type,
        text: g.Type,
        hovertemplate: `<b>${g.Type}</b><br><br>` +
            "%{yaxis.title.text}: %{y}<br>" +
            "%{x}<br>" +
            "<extra></extra>"
    }));
}

function updateMenus(data) {
    const types = ['All', ...unpack(data, 'Type')]
    const allButton = {
        args: [{
            visible: types.map(t => true),
            title: 'All'
        }],
        label: 'All',
        method: 'update'
    }
    const buttons = data.map(d => {
        return {
            args: [{
                visible: types.map(t => t === d.Type),
                title: d.Type
            }],
            label: d.Type,
            method: 'update'
        }
    })
    return [{
        buttons: [allButton, ...buttons],
        y: 1.3,
        yref: 'paper',
        yanchor: 'top'
    }]
}

function loansByTypeFigure(inputData) {
    const data = groupData(inputData);
    const updatemenus = updateMenus(data)
    return {
        data: traces(data),
        layout: {
            title: 'Loans by item type',
            hovermode: 'closest',
            yaxis: {
                title: "Total loans + renewals"
            },
            xaxis: {
                title: "Month"
            },
            showlegend: false,
            clickmode: 'select',
            updatemenus: updatemenus
        }
    };
}

export default loansByTypeFigure