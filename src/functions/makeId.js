export default function makeID(str){
    return str.replace(/\s+/g, '-').toLowerCase()
}