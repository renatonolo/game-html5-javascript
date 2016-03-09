function RatDimensions(){
    
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
        dimensions.south.stopped[0].x = 653;
        dimensions.south.stopped[0].y = 128;
        dimensions.south.stopped[0].w = 9;
        dimensions.south.stopped[0].h = 27;
        dimensions.south.stopped[0].topOffset = 0;
        dimensions.south.stopped[0].leftOffset = 0;

        //Walking 1
        dimensions.south.walking[0].x = 13;
        dimensions.south.walking[0].y = 160;
        dimensions.south.walking[0].w = 9;
        dimensions.south.walking[0].h = 27;
        dimensions.south.walking[0].topOffset = 0;
        dimensions.south.walking[0].leftOffset = 0;

        //Walking 2
        dimensions.south.walking[1].x = 141;
        dimensions.south.walking[1].y = 160;
        dimensions.south.walking[1].w = 9;
        dimensions.south.walking[1].h = 27;
        dimensions.south.walking[1].topOffset = 0;
        dimensions.south.walking[1].leftOffset = 0;

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
        dimensions.north.stopped[0].x = 589;
        dimensions.north.stopped[0].y = 132;
        dimensions.north.stopped[0].w = 9;
        dimensions.north.stopped[0].h = 27;
        dimensions.north.stopped[0].topOffset = 0;
        dimensions.north.stopped[0].leftOffset = 0;

        //Walking 1
        dimensions.north.walking[0].x = 717;
        dimensions.north.walking[0].y = 132;
        dimensions.north.walking[0].w = 9;
        dimensions.north.walking[0].h = 27;
        dimensions.north.walking[0].topOffset = 0;
        dimensions.north.walking[0].leftOffset = 0;

        //Walking 2
        dimensions.north.walking[1].x = 77;
        dimensions.north.walking[1].y = 164;
        dimensions.north.walking[1].w = 9;
        dimensions.north.walking[1].h = 27;
        dimensions.north.walking[1].topOffset = 0;
        dimensions.north.walking[1].leftOffset = 0;

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
        dimensions.east.stopped[0].x = 608;
        dimensions.east.stopped[0].y = 141;
        dimensions.east.stopped[0].w = 27;
        dimensions.east.stopped[0].h = 9;
        dimensions.east.stopped[0].topOffset = 0;
        dimensions.east.stopped[0].leftOffset = 0;

        //Walking 1
        dimensions.east.walking[0].x = 736;
        dimensions.east.walking[0].y = 141;
        dimensions.east.walking[0].w = 27;
        dimensions.east.walking[0].h = 9;
        dimensions.east.walking[0].topOffset = 0;
        dimensions.east.walking[0].leftOffset = 0;

        //Walking 2
        dimensions.east.walking[1].x = 96;
        dimensions.east.walking[1].y = 173;
        dimensions.east.walking[1].w = 27;
        dimensions.east.walking[1].h = 9;
        dimensions.east.walking[1].topOffset = 0;
        dimensions.east.walking[1].leftOffset = 0;

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
        dimensions.west.stopped[0].x = 675;
        dimensions.west.stopped[0].y = 141;
        dimensions.west.stopped[0].w = 27;
        dimensions.west.stopped[0].h = 9;
        dimensions.west.stopped[0].topOffset = 0;
        dimensions.west.stopped[0].leftOffset = 0;

        //Walking 1
        dimensions.west.walking[0].x = 36;
        dimensions.west.walking[0].y = 173;
        dimensions.west.walking[0].w = 27;
        dimensions.west.walking[0].h = 9;
        dimensions.west.walking[0].topOffset = 0;
        dimensions.west.walking[0].leftOffset = 0;

        //Walking 2
        dimensions.west.walking[1].x = 164;
        dimensions.west.walking[1].y = 173;
        dimensions.west.walking[1].w = 27;
        dimensions.west.walking[1].h = 9;
        dimensions.west.walking[1].topOffset = 0;
        dimensions.west.walking[1].leftOffset = 0;

        return dimensions;
    }
}