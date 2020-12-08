const style = {
    alignmentBaseline: 'middle',
    textAnchor: 'middle',
    fontSize: 'medium'
}

const Title = ({children, ...props}) => <text style={style} {...props}>{children}</text>

export default Title