<!--
 Copyright (C) 2016-2019 Jones Magloire @Joxit

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->
<image-content-digest>
  <div title="{ this.title }">{ this.display_id }</div>
  <script type="text/javascript">
    const self = this;
    opts.image.on('content-id', function(id) {
      self.id = id;
      self.onResize();
      window.addEventListener('resize', self.onResize);

      // this may be run before the final document size is available, so schedule
      //  a correction once every thing is set up.
      window.addEventListener('load', self.onResize);
    });
    self.onResize = function() {
        if (window.innerWidth >= 1432) {
            self.display_id = self.id;
            self.title = '';
        } else if (window.innerWidth < 1024) {
            self.display_id = '';
            self.title = self.id;
        } else {
            let scale = (window.innerWidth - 1024) / 416;
            self.display_id = self.id.slice(0, 15 + 56 * scale) + '...';
            self.title = self.id;
        }
        self.update();
    };
    opts.image.trigger('get-content-id');
  </script>
</image-content-digest>