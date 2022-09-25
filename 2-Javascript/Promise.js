class Promize {
  constructor(executer) {
    this.resolved = false;
    this.result = null;
    this.handler = null;
    // send res and rej to executer
    // res and rej will be called asynchronously always
    try {
      executer(
        (value) => {
          queueMicrotask(() => {
            if(!this.resolved){
	    this.resolved = true;
            this.result = value;
            this.handler?.(value);
	    }
          });
        },
        (value) => {
          queueMicrotask(() => {
            this.resolved = false;
            this.result = value;
            // if there is no hanlder throw error , otherwise call handler, doesn't matter then or catch handler just call it
            if (!this.handler) throw "promize rejected";
            this.handler(value);
          });
        }
      );
    } catch (error) {
      queueMicrotask(() => {
        this.resolved = false;
        this.result = value;
        // if there is no hanlder throw error , otherwise call handler, doesn't matter then or catch handler just call it
        if (!this.handler) throw "promize rejected";
        this.handler(value);
      });
    }
  }
  catch(onRejection) {
    return new Promize((res, rej) => {
      this.handler = (value) => {
        if (this.resolved) {
          res(value);
        } else {
          try {
            let result = onRejection(value);
            if (result instanceof Promize) {
              result.then(res).catch(rej);
            } else {
              res(result);
            }
          } catch (err) {
            rej(err);
          }
        }
      };
    });
  }
  then(onFullfilled) {
    return new Promize((res, rej) => {
      this.handler = (value) => {
        if (!this.resolved) {
          rej(value);
        } else {
          try {
            let result = onFullfilled(value);
            if (result instanceof Promize) {
              result.then(res).catch(rej);
            } else {
              res(result);
            }
          } catch (err) {
            rej(err);
          }
        }
      };
    });
  }
  static all(promises) {
    
  }
}
