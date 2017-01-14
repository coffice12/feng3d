module feng3d {

    export type OBJ_Face = {
        vertexIndices: number[];
    };

    export type OBJ_SubOBJ = {
        material: string;
        faces: OBJ_Face[];
    };

    export type OBJ_OBJ = {
        name: string;
        vertex: number[];
        subObjs: OBJ_SubOBJ[];
    };

    export type OBJ_OBJData = {
        mtl: string;
        objs: OBJ_OBJ[];
    }

	/**
	 * Obj模型解析器
     * @author feng 2017-01-13
	 */
    export class OBJParser {

        static parser(context: string) {

            var objData: OBJ_OBJData = { mtl: null, objs: [] };
            var lines = context.split("\n").reverse();
            do {
                var line = lines.pop();
                parserLine(line, objData);
            } while (line);
            currentObj = null;
            currentSubObj = null;
            return objData;
        }


    }
    var mtlReg = /mtllib\s+([\w.]+)/;
    var objReg = /o\s+([\w]+)/;
    var vertexReg = /v\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/;
    var usemtlReg = /usemtl\s+([\w.]+)/;
    var faceReg = /f\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;

    //
    var currentObj: OBJ_OBJ;
    var currentSubObj: OBJ_SubOBJ;

    function parserLine(line: string, objData: OBJ_OBJData) {
        if (!line)
            return;
        line = line.trim();
        if (!line.length)
            return;
        if (line.charAt(0) == "#")
            return;

        var result: RegExpExecArray;
        if ((result = mtlReg.exec(line)) && result[0] == line) {
            objData.mtl = result[1];
        } else if ((result = objReg.exec(line)) && result[0] == line) {
            currentObj = {
                name: result[1],
                vertex: [],
                subObjs: []
            };
            objData.objs.push(currentObj);
        } else if ((result = vertexReg.exec(line)) && result[0] == line) {
            currentObj.vertex.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
        } else if ((result = usemtlReg.exec(line)) && result[0] == line) {
            currentSubObj = {
                material: result[1],
                faces: []
            };
            currentObj.subObjs.push(currentSubObj);
        } else if ((result = faceReg.exec(line)) && result[0] == line) {
            currentSubObj.faces.push({
                vertexIndices: [parseInt(result[1]), parseInt(result[2]), parseInt(result[3]), parseInt(result[4])]
            });
        } else {
            throw new Error(`无法解析${line}`);
        }
    }
}