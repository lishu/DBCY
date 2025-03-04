/**
 *  标签组件
 */
import { Component } from 'react'
import { withRouter } from 'react-router-dom';

import { router2tableDetail } from '../utils/routers';
import { countStringWidth, getLabel } from '../utils/utils';

import { color_text_blue, font_table_title, font_text_title } from '../config';


//记录每个标签宽度
let widths = []

 class Table extends Component {

    //添加
    add() {
        const { templateSource, title, code } = this.props
        //防止模版被修改
        let table = JSON.parse(JSON.stringify(templateSource))
        router2tableDetail(this, { title, code, table })
    }

    //删除
    delete(index) {
        const { onTableDeleteLisenter, code } = this.props
        onTableDeleteLisenter(index, code)
    }

    //编辑
    edit(index) {
        const { tableSource, title, code } = this.props
        router2tableDetail(this, { title, code, index, table: tableSource[index] })
    }

    render() {
        const { title, tableSource, templateSource } = this.props
        //计算每个字段标题的最大宽度
        templateSource.forEach((item, index) => {
            widths[index] = countStringWidth(item.label)
        })
        //计算每个字段值的最大宽度
        tableSource.forEach(items => {
            //每一条数据
            items.forEach((item, index) => {
                let value = getLabel(item)
                if (item.itemtype === 'datepicker' || item.itemtype === 'datetimepicker') {
                    value = value.split(' ')[0]
                }
                let tempWidth = countStringWidth(value)
                //如果值的宽度大于标题的宽度就重新赋值
                if (widths[index] < tempWidth) {
                    widths[index] = tempWidth
                }
            })
        })
        return (
            <div style={{ position: 'relative' }}>
                {/* 标签名 */}
                <div style={{
                    display: 'flex',
                    padding: 10,
                    color: color_text_blue,
                    background: 'lightGray',
                    fontSize: font_table_title
                }}>
                    <div style={{ flex: 5, textAlign: 'left', fontWeight: 'bold' }}>{title}</div>
                    <div style={{ flex: 1, textAlign: 'right' }} onClick={() => this.add()}>+</div>
                </div>

                {/* 表格 */}
                <div style={{ whiteSpace: 'nowrap', overflowX: 'auto', fontSize: font_text_title }}>
                    {/* 表头 */}
                    <div style={{ display: 'flex', padding: 5, color: color_text_blue }}>
                        {
                            templateSource.map((item, index) => {
                                return (
                                    <div
                                        key={'head' + index}
                                        style={{ flex: '0 0 auto', width: widths[index], borderRight: '1px solid', textAlign: 'center' }}>
                                        {item.label}
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        // 表体
                        tableSource.map((items, parentIndex) => {
                            return (
                                <div key={'body' + parentIndex} style={{ display: 'flex' }}>
                                    {
                                        items.map((item, chiledIndex) => {
                                            let value = getLabel(item)
                                            if (item.itemtype === 'datepicker' || item.itemtype === 'datetimepicker') {
                                                value = value.split(' ')[0]
                                            }
                                            if (chiledIndex === items.length - 1) {
                                                return (
                                                    <div key={'body' + parentIndex + chiledIndex} style={{ display: 'flex', padding: 5 }}>
                                                        <div style={{ flex: '0 0 auto', width: widths[chiledIndex], textAlign: 'center' }}>{value}</div>
                                                        <div
                                                            onClick={() => this.delete(parentIndex)}
                                                            style={{ background: 'red', marginLeft: 10, width: 40, color: 'white', borderRadius: 10, textAlign: 'center' }}>
                                                            删除
                                                        </div>
                                                        <div
                                                            onClick={() => this.edit(parentIndex)}
                                                            style={{ background: 'blue', marginLeft: 10, width: 40, color: 'white', borderRadius: 10, textAlign: 'center' }}>
                                                            编辑
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return (
                                                <div
                                                    key={parentIndex + chiledIndex}
                                                    style={{ flex: '0 0 auto', width: widths[chiledIndex], padding: 5, textAlign: 'center' }}>
                                                    {value}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

}

export default withRouter(Table)