const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
    const {bookid, openid} = ctx.request.query
    const mysqlSelect = mysql('comments')
      .select('comments.*', 'cSessionInfo.user_info')
      .join('cSessionInfo', 'comments.openid', 'cSessionInfo.open_id')
    let comments
    if (bookid) {
      // 图书详情的评论列表
        comments = await mysqlSelect.where('bookid', bookid)
    } else if (openid) {
      // 评论页面
        comments = await mysqlSelect.where('openid', openid)
    }
    ctx.state.data = {
        list: comments.map(v => {
            const info = JSON.parse(v.user_info)
            return Object.assign({}, v, {
                title: info.nickName,
                image: info.avatarUrl
            })
        })
    }
}
