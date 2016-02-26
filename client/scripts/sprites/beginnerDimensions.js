function BeginnerDimensions(){
    
    this.getDimensions = function(){
        var dimensions = {};
        
        /**
         * South
         */
        dimensions.south = {};
        dimensions.south.stopped = [];
        dimensions.south.walking = [];
        dimensions.south.stopped[0] = {};
        dimensions.south.walking[0] = {};
        dimensions.south.walking[1] = {};
        dimensions.south.walking[2] = {};
        dimensions.south.walking[3] = {};
        dimensions.south.walking[4] = {};

        //Stopped
        dimensions.south.stopped[0].x = 0;
        dimensions.south.stopped[0].y = 0;
        dimensions.south.stopped[0].w = 30;
        dimensions.south.stopped[0].h = 59;
        dimensions.south.stopped[0].topOffset = 1;
        dimensions.south.stopped[0].leftOffset = 0;

        //Walking 1
        dimensions.south.walking[0].x = 64;
        dimensions.south.walking[0].y = 0;
        dimensions.south.walking[0].w = 31;
        dimensions.south.walking[0].h = 60;
        dimensions.south.walking[0].topOffset = 1;
        dimensions.south.walking[0].leftOffset = 0;

        //Walking 2
        dimensions.south.walking[1].x = 96;
        dimensions.south.walking[1].y = 0;
        dimensions.south.walking[1].w = 30;
        dimensions.south.walking[1].h = 60;
        dimensions.south.walking[1].topOffset = 0;
        dimensions.south.walking[1].leftOffset = 1;

        //Walking 3
        dimensions.south.walking[2].x = 128;
        dimensions.south.walking[2].y = 0;
        dimensions.south.walking[2].w = 30;
        dimensions.south.walking[2].h = 60;
        dimensions.south.walking[2].topOffset = 1;
        dimensions.south.walking[2].leftOffset = 0;

        //Walking 4
        dimensions.south.walking[3].x = 161;
        dimensions.south.walking[3].y = 0;
        dimensions.south.walking[3].w = 29;
        dimensions.south.walking[3].h = 60;
        dimensions.south.walking[3].topOffset = 0;
        dimensions.south.walking[3].leftOffset = -1;

        /**
         * North
         */
        dimensions.north = {};
        dimensions.north.stopped = [];
        dimensions.north.walking = [];
        dimensions.north.stopped[0] = {};
        dimensions.north.walking[0] = {};
        dimensions.north.walking[1] = {};
        dimensions.north.walking[2] = {};
        dimensions.north.walking[3] = {};
        dimensions.north.walking[4] = {};

        //Stopped
        dimensions.north.stopped[0].x = 0;
        dimensions.north.stopped[0].y = 128;
        dimensions.north.stopped[0].w = 30;
        dimensions.north.stopped[0].h = 60;
        dimensions.north.stopped[0].topOffset = 0;
        dimensions.north.stopped[0].leftOffset = -2;

        //Walking 1
        dimensions.north.walking[0].x = 64;
        dimensions.north.walking[0].y = 128;
        dimensions.north.walking[0].w = 30;
        dimensions.north.walking[0].h = 60;
        dimensions.north.walking[0].topOffset = 1;
        dimensions.north.walking[0].leftOffset = -2;

        //Walking 2
        dimensions.north.walking[1].x = 97;
        dimensions.north.walking[1].y = 128;
        dimensions.north.walking[1].w = 29;
        dimensions.north.walking[1].h = 59;
        dimensions.north.walking[1].topOffset = 0;
        dimensions.north.walking[1].leftOffset = -2;

        //Walking 3
        dimensions.north.walking[2].x = 129;
        dimensions.north.walking[2].y = 128;
        dimensions.north.walking[2].w = 29;
        dimensions.north.walking[2].h = 60;
        dimensions.north.walking[2].topOffset = 0;
        dimensions.north.walking[2].leftOffset = -2;

        //Walking 4
        dimensions.north.walking[3].x = 160;
        dimensions.north.walking[3].y = 128;
        dimensions.north.walking[3].w = 30;
        dimensions.north.walking[3].h = 59;
        dimensions.north.walking[3].topOffset = 1;
        dimensions.north.walking[3].leftOffset = -2;

        /**
         * East
         */
        dimensions.east = {};
        dimensions.east.stopped = [];
        dimensions.east.walking = [];
        dimensions.east.stopped[0] = {};
        dimensions.east.walking[0] = {};
        dimensions.east.walking[1] = {};
        dimensions.east.walking[2] = {};
        dimensions.east.walking[3] = {};
        dimensions.east.walking[4] = {};

        //Stopped
        dimensions.east.stopped[0].x = 5;
        dimensions.east.stopped[0].y = 193;
        dimensions.east.stopped[0].w = 21;
        dimensions.east.stopped[0].h = 60;
        dimensions.east.stopped[0].topOffset = 2;
        dimensions.east.stopped[0].leftOffset = 1;

        //Walking 1
        dimensions.east.walking[0].x = 69;
        dimensions.east.walking[0].y = 194;
        dimensions.east.walking[0].w = 20;
        dimensions.east.walking[0].h = 59;
        dimensions.east.walking[0].topOffset = 1;
        dimensions.east.walking[0].leftOffset = 1;

        //Walking 2
        dimensions.east.walking[1].x = 99;
        dimensions.east.walking[1].y = 195;
        dimensions.east.walking[1].w = 24;
        dimensions.east.walking[1].h = 57;
        dimensions.east.walking[1].topOffset = 0;
        dimensions.east.walking[1].leftOffset = 3;

        //Walking 3
        dimensions.east.walking[2].x = 133;
        dimensions.east.walking[2].y = 194;
        dimensions.east.walking[2].w = 21;
        dimensions.east.walking[2].h = 59;
        dimensions.east.walking[2].topOffset = 1;
        dimensions.east.walking[2].leftOffset = 1;

        //Walking 4
        dimensions.east.walking[3].x = 163;
        dimensions.east.walking[3].y = 195;
        dimensions.east.walking[3].w = 24;
        dimensions.east.walking[3].h = 56;
        dimensions.east.walking[3].topOffset = 1;
        dimensions.east.walking[3].leftOffset = 3;

        /**
         * West
         */
        dimensions.west = {};
        dimensions.west.stopped = [];
        dimensions.west.walking = [];
        dimensions.west.stopped[0] = {};
        dimensions.west.walking[0] = {};
        dimensions.west.walking[1] = {};
        dimensions.west.walking[2] = {};
        dimensions.west.walking[3] = {};
        dimensions.west.walking[4] = {};

        //Stopped
        dimensions.west.stopped[0].x = 6;
        dimensions.west.stopped[0].y = 62;
        dimensions.west.stopped[0].w = 18;
        dimensions.west.stopped[0].h = 59;
        dimensions.west.stopped[0].topOffset = 1;
        dimensions.west.stopped[0].leftOffset = 0;

        //Walking 1
        dimensions.west.walking[0].x = 70;
        dimensions.west.walking[0].y = 63;
        dimensions.west.walking[0].w = 20;
        dimensions.west.walking[0].h = 58;
        dimensions.west.walking[0].topOffset = 2;
        dimensions.west.walking[0].leftOffset = 0;

        //Walking 2
        dimensions.west.walking[1].x = 99;
        dimensions.west.walking[1].y = 64;
        dimensions.west.walking[1].w = 23;
        dimensions.west.walking[1].h = 55;
        dimensions.west.walking[1].topOffset = 1;
        dimensions.west.walking[1].leftOffset = -6;

        //Walking 3
        dimensions.west.walking[2].x = 135;
        dimensions.west.walking[2].y = 63;
        dimensions.west.walking[2].w = 16;
        dimensions.west.walking[2].h = 58;
        dimensions.west.walking[2].topOffset = 2;
        dimensions.west.walking[2].leftOffset = 0;

        //Walking 4
        dimensions.west.walking[3].x = 163;
        dimensions.west.walking[3].y = 64;
        dimensions.west.walking[3].w = 23;
        dimensions.west.walking[3].h = 56;
        dimensions.west.walking[3].topOffset = 2;
        dimensions.west.walking[3].leftOffset = 0;

        return dimensions;
    }
}