// The code below is from https://github.com/bmoren/p5.collide2D
export function collisionRectRect(x, y, w, h, x2, y2, w2, h2) {
    return x + w >= x2 && // r1 right edge past r2 left
        x <= x2 + w2 && // r1 left edge past r2 right
        y + h >= y2 && // r1 top edge past r2 bottom
        y <= y2 + h2; // r1 bottom edge past r2 top
}
export function collisionPointCircle(x, y, cx, cy, d) {
    return p5.dist(x, y, cx, cy) <= d / 2;
}
export function collisionPointLine(px, py, x1, y1, x2, y2, buffer) {
    // get distance from the point to the two ends of the line
    var d1 = p5.dist(px, py, x1, y1);
    var d2 = p5.dist(px, py, x2, y2);
    // get the length of the line
    var lineLen = p5.dist(x1, y1, x2, y2);
    // since floats are so minutely accurate, add a little buffer zone that will give collision
    if (buffer === undefined)
        buffer = 0.1; // higher # = less accurate
    // if the two distances are equal to the line's length, the point is on the line!
    // note we use the buffer here to give a range, rather than one #
    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
        return true;
    }
    return false;
}
export function collisionLineCircle(x1, y1, x2, y2, cx, cy, diameter) {
    // is either end INSIDE the circle?
    // if so, return true immediately
    var inside1 = collisionPointCircle(x1, y1, cx, cy, diameter);
    var inside2 = collisionPointCircle(x2, y2, cx, cy, diameter);
    if (inside1 || inside2)
        return true;
    // get length of the line
    var distX = x1 - x2;
    var distY = y1 - y2;
    var len = Math.sqrt((distX * distX) + (distY * distY));
    // get dot product of the line and circle
    var dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(len, 2);
    // find the closest point on the line
    var closestX = x1 + (dot * (x2 - x1));
    var closestY = y1 + (dot * (y2 - y1));
    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    var onSegment = collisionPointLine(closestX, closestY, x1, y1, x2, y2);
    if (!onSegment)
        return false;
    // // draw a debug circle at the closest point on the line
    // if(this._collideDebug){
    //   this.ellipse(closestX, closestY,10,10);
    // }
    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    var distance = Math.sqrt((distX * distX) + (distY * distY));
    return distance <= diameter / 2;
}
