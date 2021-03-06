/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */

var ARGO = require("./argo");

ARGO.parse = function (string, reviver) {
    var stack = [];
    var at;
    var value;
    var lineNumber = 1;
    var lineIndex = 0;
    var handlers = {
        push: function (object) {
            stack.push(object);
            at = object;
        },
        pop: function () {
            value = stack.pop();
            at = stack[stack.length - 1];
        },
        set: function (key) {
            if (reviver) {
                value = reviver.call(at, key, value);
            }
            at[key] = value;
        },
        emit: function (_value, index, lastIndex) {
            value = _value;
        },
        newLine: function (index) {
            lineNumber++;
            lineIndex = index;
        },
        error: function (error, index) {
            error.index = index;
            error.lineNumber = lineNumber;
            error.columnNumber = index - lineIndex;
            throw error;
        }
    };
    var stream = ARGO.makeWritableStream(handlers);
    stream.end(string);
    return value;
};

console.log(ARGO.parse('{"a": 10, "b": [1, 2, 3]}'));
